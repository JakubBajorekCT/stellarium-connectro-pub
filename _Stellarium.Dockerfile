FROM debian:trixie-slim
RUN apt-get update && apt-get install -y stellarium mesa-utils libgl1 && rm -rf /var/lib/apt/lists/*
CMD ["stellarium", "-L"]
