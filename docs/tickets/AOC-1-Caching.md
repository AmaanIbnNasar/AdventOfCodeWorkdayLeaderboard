# AOC-1-Caching

## Description

The caching system is a key component of the application. It is used to store the data of the API calls and to avoid making the same calls multiple times. We will implement this by using SSM (to store the last updated cache time) and S3 (to store the cache data).

The backend will need to change to support this. The API calls will need to be modified to check the cache before making the call. The API calls will also need to be modified to update the cache after making the call.
