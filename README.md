# ReSeT faceter - Relational Search Tool for Finnish Cultural History


# Installation

`bower install`

# Running locally

You will need to serve the files with a server, for example python's
built-in HTTP server:

`python3 -m http.server`

Then navigate to `http://localhost:8000`.

# Docker

Build: `docker build -t reset-faceter .`

Run: `docker run -it --rm -p 8000:8000 --name reset-faceter reset-faceter`