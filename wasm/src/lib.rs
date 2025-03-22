use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use serde_wasm_bindgen;
use std::collections::{BinaryHeap, HashMap};
use std::cmp::Ordering;

#[derive(Clone, Serialize, Deserialize)]
pub struct Point {
    lat: f64,
    lon: f64,
}

#[derive(Eq, PartialEq)]
struct Node {
    cost: i32,
    position: (i32, i32),
}

impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost)
    }
}

impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

#[derive(Serialize, Deserialize)]
pub struct Coordinates {
    lat: f64,
    lng: f64,
}

#[wasm_bindgen]
pub fn find_path(start_lat: f64, start_lng: f64, end_lat: f64, end_lng: f64) -> JsValue {
    // Set up console error panic hook for better debugging
    console_error_panic_hook::set_once();
    
    // Convert to grid coordinates (simplified for example)
    let start_x = (start_lng * 100.0) as i32;
    let start_y = (start_lat * 100.0) as i32;
    let end_x = (end_lng * 100.0) as i32;
    let end_y = (end_lat * 100.0) as i32;
    
    // Run A* pathfinding
    let grid_path = a_star((start_x, start_y), (end_x, end_y));
    
    // Convert back to geographic coordinates
    let geo_path: Vec<Coordinates> = grid_path.into_iter()
        .map(|(x, y)| Coordinates {
            lat: y as f64 / 100.0,
            lng: x as f64 / 100.0,
        })
        .collect();
    
    // If no path found, fall back to interpolation
    let path = if geo_path.is_empty() {
        // Simple linear interpolation as fallback
        let steps = 10;
        (0..=steps).map(|i| {
            let t = i as f64 / steps as f64;
            let lat = start_lat + (end_lat - start_lat) * t;
            let lng = start_lng + (end_lng - start_lng) * t;
            Coordinates { lat, lng }
        }).collect()
    } else {
        geo_path
    };
    
    serde_wasm_bindgen::to_value(&path).unwrap()
}

fn a_star(start: (i32, i32), goal: (i32, i32)) -> Vec<(i32, i32)> {
    let mut open_set = BinaryHeap::new();
    let mut came_from = HashMap::new();
    let mut g_score = HashMap::new();
    
    g_score.insert(start, 0);
    open_set.push(Node {
        cost: manhattan_distance(start, goal),
        position: start,
    });

    while let Some(current) = open_set.pop() {
        if current.position == goal {
            return reconstruct_path(came_from, current.position);
        }

        for neighbor in get_neighbors(current.position) {
            let tentative_g_score = g_score.get(&current.position).unwrap() + 1;
            
            if tentative_g_score < *g_score.get(&neighbor).unwrap_or(&i32::MAX) {
                came_from.insert(neighbor, current.position);
                g_score.insert(neighbor, tentative_g_score);
                open_set.push(Node {
                    cost: tentative_g_score + manhattan_distance(neighbor, goal),
                    position: neighbor,
                });
            }
        }
    }
    vec![] // No path found
}

fn manhattan_distance(a: (i32, i32), b: (i32, i32)) -> i32 {
    (a.0 - b.0).abs() + (a.1 - b.1).abs()
}

fn get_neighbors(pos: (i32, i32)) -> Vec<(i32, i32)> {
    vec![
        (pos.0 + 1, pos.1),
        (pos.0 - 1, pos.1),
        (pos.0, pos.1 + 1),
        (pos.0, pos.1 - 1),
    ]
}

fn reconstruct_path(came_from: HashMap<(i32, i32), (i32, i32)>, mut current: (i32, i32)) -> Vec<(i32, i32)> {
    let mut path = vec![current];
    while let Some(&prev) = came_from.get(&current) {
        path.push(prev);
        current = prev;
    }
    path.reverse();
    path
}