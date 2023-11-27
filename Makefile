build: build-backend build-cache

release: release-backend release-cache

build-backend:
	cargo lambda build --bin backend

install: install-rust

install-rust:
	scoop bucket add cargo-lambda https://github.com/cargo-lambda/scoop-cargo-lambda
	scoop install cargo-lambda/cargo-lambda
	rustup target add aarch64-unknown-linux-musl
	cargo install cross --git https://github.com/cross-rs/cross

watch:
	cargo lambda watch

release-backend:
	cargo lambda build --compiler cross --release --target aarch64-unknown-linux-musl --bin backend
	mkdir package
	cp target/lambda/backend/bootstrap ./package/bootstrap
	cp data/AOC_response.json ./package/AOC_response.json
	zip -j package_backend.zip package/*
	rm -r package

build-cache:
	cargo lambda build --bin cache

release-cache:
	cargo lambda build --compiler cross --release --target aarch64-unknown-linux-musl --bin cache
	mkdir package
	cp target/lambda/cache/bootstrap ./package/bootstrap
	zip -j package_cache.zip package/*
	rm -r package

clean:
	rm -r target
	rm package_backend.zip
	rm package_cache.zip

terraform-init: terraform-clean
	cd terraform && terraform init -backend-config=main.conf
	cd terraform && terraform workspace new main || terraform workspace select main
	cd terraform && terraform init

terraform-clean:
	cd terraform && rm -rf .terraform 

terraform-plan: terraform-init
	cd terraform && terraform plan

terraform-apply: terraform-init
	cd terraform && terraform apply -auto-approve