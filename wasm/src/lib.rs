use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
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

#[wasm_bindgen]
pub fn find_path(start_lat: f64, start_lon: f64, end_lat: f64, end_lon: f64) -> String {
    let start = Point { lat: start_lat, lon: start_lon };
    let end = Point { lat: end_lat, lon: end_lon };
    
    // Convert to grid coordinates (simplified for demo)
    let start_grid = (
        (start.lat * 100.0) as i32,
        (start.lon * 100.0) as i32
    );
    let end_grid = (
        (end.lat * 100.0) as i32,
        (end.lon * 100.0) as i32
    );

    let path = a_star(start_grid, end_grid);
    
    // Convert path back to coordinates
    let path_points: Vec<Point> = path.iter()
        .map(|(x, y)| Point {
            lat: *x as f64 / 100.0,
            lon: *y as f64 / 100.0,
        })
        .collect();

    serde_json::to_string(&path_points).unwrap_or_else(|_| "[]".to_string())
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