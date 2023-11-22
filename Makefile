build: build-backend

build-backend:
	cargo lambda build --bin backend

install: install-backend

install-backend:
	scoop bucket add cargo-lambda https://github.com/cargo-lambda/scoop-cargo-lambda
	scoop install cargo-lambda/cargo-lambda

watch-backend:
	cargo lambda watch

release-backend:
	cargo lambda build --compiler cross --release --target aarch64-unknown-linux-musl
	mkdir package
	cp target/lambda/backend/bootstrap ./package/bootstrap
	cp data/AOC_response.json ./package/AOC_response.json
	zip -j package.zip package/*
	rm -r package

clean:
	rm -r target
	rm package.zip

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