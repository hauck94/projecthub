# Notes Widget

This folder contains all files relevant for the notes widget.
The notes-widget internally uses etherpad.

## Build and Deploy

Make soure you are in the correct folder

```bash
cd ./widgets/notes/
```

Before you start building the image, make sure to specify the environment variables inside the docker container.
To build a new version of the widget use the following command:

```bash
docker build -t registry.code.fbi.h-da.de/project-hub/project-hub/notes .
```

You can use the following command to test the image:

```bash
docker run -p 9001:9001 registry.code.fbi.h-da.de/project-hub/project-hub/notes
```

Before you push the image make sure you are logged in to the registry:

```bash
docker login registry.code.fbi.h-da.de
```

To push a new Version to the registry use the following command:

```bash
docker push registry.code.fbi.h-da.de/project-hub/project-hub/notes
```
