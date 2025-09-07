#!/usr/bin/env python3
"""
Script to create a large CSV file (>1MB) for testing upload limits
"""

import csv
import os

def create_large_csv(filename, target_size_mb=1.5):
    """
    Create a CSV file larger than the specified size in MB
    """
    target_size_bytes = target_size_mb * 1024 * 1024

    # CSV headers
    headers = ['title', 'description', 'status', 'priority', 'assigned_to']

    # Sample data to repeat
    sample_data = [
        'Network connectivity issue in server room A',
        'Users are experiencing slow response times when accessing the main application. The issue appears to be intermittent and affects approximately 30% of users during peak hours.',
        'Open',
        'High',
        'john.doe@company.com'
    ]

    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)

        # Write headers
        writer.writerow(headers)

        # Keep adding rows until we exceed target size
        row_count = 0
        while os.path.getsize(filename) < target_size_bytes:
            # Vary the data slightly for each row
            row_data = [
                f'{sample_data[0]} - Incident #{row_count + 1}',
                f'{sample_data[1]} This is row number {row_count + 1} in the test data.',
                sample_data[2],
                sample_data[3],
                f'user{row_count % 100}@company.com'  # Cycle through 100 different users
            ]
            writer.writerow(row_data)
            row_count += 1

            # Print progress every 1000 rows
            if row_count % 1000 == 0:
                current_size = os.path.getsize(filename) / (1024 * 1024)
                print(".2f")

    final_size = os.path.getsize(filename) / (1024 * 1024)
    print(".2f")
    print(f"Total rows: {row_count}")

if __name__ == "__main__":
    filename = "large_test_incidents.csv"
    create_large_csv(filename, target_size_mb=1.5)

    print(f"\nCSV file '{filename}' created successfully!")
    print("You can now use this file to test the 1MB upload limit.")