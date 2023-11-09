build: build-backend

build-backend:
	cargo lambda build --bin backend

install: install-backend

install-backend:
	scoop bucket add cargo-lambda https://github.com/cargo-lambda/scoop-cargo-lambda
	scoop install cargo-lambda/cargo-lambda

watch-backend:
	cargo lambda watch
