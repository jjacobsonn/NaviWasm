import click

@click.command()
@click.option('--start', prompt='Start location', help='Starting coordinates (e.g. "lat,lon").')
@click.option('--end', prompt='End location', help='Ending coordinates (e.g. "lat,lon").')
def navigate(start, end):
    # ...call the backend API or integrate with the Rust wasm...
    click.echo(f"Calculating path from {start} to {end}...")
    # ...existing logic to compute path...
    click.echo("Path computed successfully!")

if __name__ == '__main__':
    navigate()