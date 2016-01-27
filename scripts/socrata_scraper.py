#!/usr/bin/python3

"""
This is a basic script that downloads the catalog data from the smcgov.org
website and pulls out information about all the datasets.

This is in python3

There is an optional download_all argument that will allow you to download
all of the datasets individually and in their entirety. I have included this
as a demonstration, but it should not be commonly used because it takes a
while and beats up on the smcgov data portal, which you should avoid.

"""

import sys
import json
import argparse
import collections
import urllib.request

URL = "https://data.smcgov.org/api/catalog?limit=999999999&only=datasets"

def main(args):
    category_data = collections.defaultdict(list)
    domain_data = collections.defaultdict(list)
    data_downloads = []
    datasets_with_location = []
    with urllib.request.urlopen(URL) as raw_data:
        data = json.loads(raw_data.read().decode('utf-8'))
        for result in data['results']:
            categories = result['classification']['categories']
            domain = result['classification']['domain_category']
            if categories is None or categories == []:
                categories = ['NULL']
            permalink = result['permalink']
            data_downloads.append('{}.json'.format(permalink))
            domain_data[domain].append(permalink)
            for category in categories:
                category_data[category].append(permalink)

    if args.download_all:
        for download_url in data_downloads:
            with urllib.request.urlopen(download_url) as dataset_file:
                print('Downloading {}'.format(download_url))
                dataset = json.loads(dataset_file.read().decode('utf-8'))
                if len(dataset) < 1:
                    continue
                if 'location_1' in dataset[0].keys():
                    # Our best guess on which datasets have location info.
                    datasets_with_location.append(download_url)

    if args.download_all:
        print('Datasets with location_1 key')
        print(datasets_with_location)
    print('----------------------------------------------------')
    print('Number of Datasets by Category')
    for key, values in category_data.items():
        print(key, len(values))
    print('----------------------------------------------------')
    print('Number of Datasets by Domain')
    for key, values in domain_data.items():
        print(key, len(values))

if __name__=='__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--download_all', help='Download all datasets',
                        action='store_true')
    args = parser.parse_args()
    main(args=args)
