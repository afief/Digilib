# Digital Library

#### Install Ionic
```
npm install -g cordova ionic
```

#### Install Gulp for script and sass bundler
```
npm install -g gulp
```

#### Running This Project
##### 1. Clone this repo
```
git clone https://github.com/afief/digilib.git
```

##### 2. Step inside the directory
```
cd digilib
```

##### 3. Install npm dependencies
```
npm install
```

##### 4. Compile resources (logo and splash screen)
```
ionic cordova resources
```

##### 5. Install bower dependencies (inside www/lib)
```
gulp install
```

##### 6. Compile script and sass
```
gulp sass
gulp compile-scripts
```

##### 7. Running project on your browser
```
ionic serve
```
