deploy:
	yarn build
	git checkout prod
	cp -a ./build/. ./
	git add .
	git commit -m 'deployment to GH pages'
	git push
	git checkout main