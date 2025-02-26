1. Create a Mapbox account and obtain an API key.
2. Set the Mapbox API key as an environment variable in the React project.
3. Ensure the React component uses the Mapbox API key correctly.
4. Set up the FastAPI project for pathfinding requests.
5. Compile the Rust pathfinding library to WebAssembly (WASM).
6. Integrate Rust/WASM pathfinding into the FastAPI project.
7. Create a FastAPI endpoint for start/end coordinates, returning paths as GeoJSON.
8. In React, request paths from FastAPI and display on the Mapbox map.
9. Simulate real-time marker movement along the path using setInterval.
10. Deploy on Vercel, ensuring environment variables are set for React and FastAPI.
11. Monitor Mapbox usage on the Statistics page to stay within 50,000 map loads.
12. Deactivate the Mapbox API key when done to avoid charges.