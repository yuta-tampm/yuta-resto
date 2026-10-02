FROM --platform=linux/amd64 python@sha256:9c47360a2a0355e2da18516d0b1c2126ec22c195d2185e97347c9d98398c5bef
ENV LANG=C LC_ALL=C TZ=UTC PYTHONHASHSEED=0 PYTHONUTF8=1 PYTHONDONTWRITEBYTECODE=1 PYTHONNOUSERSITE=1
WORKDIR /work
COPY requirements.lock /opt/vfix/requirements.lock
COPY wheelhouse/ /opt/vfix/wheelhouse/
RUN python -m pip install --no-cache-dir --no-compile --require-hashes --no-index --no-deps --only-binary=:all: --find-links=/opt/vfix/wheelhouse -r /opt/vfix/requirements.lock
COPY run.py environment.json /opt/vfix/
USER 65534:65534
ENTRYPOINT ["python", "-B", "-s", "/opt/vfix/run.py"]
