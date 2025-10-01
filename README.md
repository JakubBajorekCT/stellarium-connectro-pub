# stellarium-connectro
## What it does?
Main idea was to synchronize Stellarium PC instance with mobile one. In that case we need proxy, that:
- will act as a Nexstar telescope, so mobile Stellarium will send commands like "go to position"
- will translate commands and parameters from Nexstar to Stellarium api
- will communicate with Stellarium PC instance using remote control plugin
## Requirements
- Stellarium mobile plus v1.15.0 (paid version, as we need option to connect to telescope)
- Run as standalone version - install on your host:
  - Stellarium PC v24
  - Node: v22.18.0
- Docker version - tested on Debian trixie with Wayland, install on your host:
  - Docker v28
  - Docker-compose as a plugin
## How to run?
### Standalone version
- install dependencies for standalone version
- start Stellarium PC and configure
  - in settings enable Remote control plugin
- start proxy with command `npm start`
  - edit configuration in [settings](./src/settings.ts) file if necessary (standalone section)
- start Stellarium mobile app
  - configure connection in "Observing tools" -> "Telescope control"
### Docker version
- install dependencies for docker version
- edit configuration in [settings](./src/settings.ts) file if necessary (docker section)
- adjust if needed settings in [docker-compose.yaml](./docker-compose.yaml)
- start containers with `docker compose  up --build`, in Stellarium PC configure
  - in settings enable Remote control plugin
- start Stellarium mobile app
  - configure connection in "Observing tools" -> "Telescope control"
## Known issues
- **slew movement may don't work properly with specific zoom** - planned fix by using unit vector or other endpoint
