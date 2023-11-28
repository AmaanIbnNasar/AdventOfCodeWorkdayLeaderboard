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

check-lambda-name:
ifndef lambda_name
	$(error lambda_name is undefined)
endif

create-build-directory:
	mkdir -p build/

package-all:
	$(MAKE) package-ts-lambda lambda_name=solutions_uploader
	$(MAKE) package-ts-lambda lambda_name=solutions_retriever
	$(MAKE) release-backend
	$(MAKE) release-cache

package-ts-lambda: 
	${MAKE} package-node-lambda lambda_name=${lambda_name} index_file=index.ts

package-node-lambda: create-build-directory check-lambda-name
	rm -f build/${lambda_name}.zip
	mkdir -p lambda/${lambda_name}-build && \
	yarn esbuild packages/${lambda_name}/${index_file} --bundle --outfile=lambda/${lambda_name}-build/index.cjs --platform=node && \
	cd lambda/${lambda_name}-build && \
	zip -q -r ../../build/${lambda_name}.zip * && \
	cd ../../ && \
	rm -rf lambda/${lambda_name}-build
	@echo "Successfully built lambda ${lambda_name}"

terraform-init-for-%: terraform-clean
	cd terraform && terraform init -backend-config=$*.conf
	cd terraform && terraform workspace new $* || terraform workspace select $*
	cd terraform && terraform init

terraform-clean:
	cd terraform && rm -rf .terraform 

terraform-plan-for-%: terraform-init-for-%
	cd terraform && terraform plan

terraform-apply-for-%: terraform-init-for-%
	cd terraform && terraform apply -auto-approve