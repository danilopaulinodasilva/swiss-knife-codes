/* gulpfile.js for Gulp ^4.0.2 */

// const env_dev = "http://localhost:5003/";
// const env_prod = "https://the-ybox.dev/gestor/";

const gulp = require('gulp'),
	sass = require('gulp-sass'),
	inject = require('gulp-inject'),
	concat = require('gulp-concat'),
	replace = require('gulp-string-replace'),
	imagemin = require('gulp-imagemin'),
	cssnano = require('gulp-cssnano'),
	terser = require('gulp-terser'),
	sourcemaps = require('gulp-sourcemaps'),
	clean = require('gulp-clean'),
	browserSync = require('browser-sync').create(),
	fs = require('fs'),
	paths = {
		src: 'src/',
		srcHtml: 'src/**/',
		srcPhp: 'src/**/',
		srcScss: 'src/scss/',
		srcCss: 'src/css/',
		srcJs: 'src/js/',
		srcVendors: 'src/js/vendors/',
		srcPlugins: 'src/scss/plugins/',
		srcImg: 'src/img/',
		dist: 'dist/',
		distCss: 'dist/css/',
		distJs: 'dist/js/',
		distImg: 'dist/img/',
		distHtml: 'dist/**/',
		distPhp: 'dist/**/',
		nodeModules: 'node_modules/'
	},
	vendors = [
		paths.nodeModules + 'jquery/dist/jquery.min.js',
		paths.nodeModules + 'bootstrap/dist/js/bootstrap.bundle.min.js',
	],
	plugins = [paths.nodeModules + 'bootstrap/dist/css/bootstrap.css'];

gulp.task('inject', gulp.series(function () {
	let target = gulp.src([paths.srcHtml + '*.html', paths.srcPhp + '*.php']);
	let sources = gulp.src([paths.srcJs + '*.js', paths.srcCss + '*.css'], {
		read: false
	});

	return target.pipe(inject(sources, {
			relative: true
		}))
		.pipe(gulp.dest(paths.src))

}));

gulp.task('sass', gulp.series(function () {
	return gulp.src(paths.srcScss + '*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.srcCss))
		.pipe(browserSync.stream());

}));

gulp.task('plugins', gulp.series(function () {
	return gulp.src(plugins)
		.pipe(gulp.dest(paths.srcPlugins))

}));

gulp.task('vendors', gulp.series(function () {

	fs.readdirSync(paths.srcVendors).forEach(file => vendors.push(paths.srcVendors + file));

	return gulp.src(vendors)
		.pipe(concat('0-vendors.js'))
		.pipe(gulp.dest(paths.srcJs))

}));

gulp.task('watch', gulp.series(function () {
	browserSync.init({
		server: {
			baseDir: paths.src
		},
		browser: ["microsoft-edge", "edge", "microsoft edge"],
		port: 8080,
		open: false
	});

	gulp.watch(paths.srcScss + '**/*.scss', gulp.series('sass'));
	gulp.watch(paths.srcJs + '*.js').on('change', browserSync.reload);
	gulp.watch(paths.srcJs + '*.js').on('add', gulp.series('inject'));
	gulp.watch(paths.srcJs + '*.js').on('unlink', gulp.series('inject'));
	gulp.watch(paths.srcVendors + '*.js').on('change', gulp.series('vendors'));
	gulp.watch(paths.srcVendors + '*.js').on('add', gulp.series('vendors'));
	gulp.watch(paths.srcVendors + '*.js').on('unlink', gulp.series('vendors'));
	gulp.watch(paths.srcHtml + '*.html').on('change', browserSync.reload);
	gulp.watch(paths.srcHtml + '*.html').on('add', gulp.series('inject'));
	gulp.watch(paths.srcHtml + '*.php').on('change', browserSync.reload);
	gulp.watch(paths.srcHtml + '*.php').on('add', gulp.series('inject'));
}));

gulp.task('clean-css', gulp.series(function () {
	return gulp.src(paths.distCss, {
			read: false,
			allowEmpty: true
		})
		.pipe(clean());
}))

gulp.task('clean-js', gulp.series(function () {
	return gulp.src(paths.distJs, {
			read: false,
			allowEmpty: true

		})
		.pipe(clean());
}))

gulp.task('clean-img', gulp.series(function () {
	return gulp.src(paths.distImg, {
			read: false,
			allowEmpty: true

		})
		.pipe(clean());
}))

gulp.task('build-css', gulp.series('clean-css', function () {
	return gulp.src(paths.srcCss + '*.css')
		.pipe(sourcemaps.init())
		.pipe(concat('styles.css'))
		.pipe(cssnano())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.distCss))

}));

gulp.task('build-js', gulp.series('clean-js', function () {
	return gulp.src(paths.srcJs + '*.js')
		// .pipe(replace(env_dev, env_prod))
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(terser())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.distJs))

}));

gulp.task('build-img', gulp.series('clean-img', function () {
	return gulp.src(paths.srcImg + '**/*')
		.pipe(imagemin())
		.pipe(gulp.dest(paths.distImg))

}));

gulp.task('build-html', gulp.series(function () {
	return gulp.src(paths.srcHtml + '*.html', {
			base: paths.src
		})
		.pipe(gulp.dest(paths.dist))
}));

gulp.task('build-php', gulp.series(function () {
	return gulp.src(paths.srcPhp + '*.php', {
			base: paths.src
		})
		.pipe(gulp.dest(paths.dist))
}));

gulp.task('build-inject', gulp.series(function () {
	let target = gulp.src([paths.distHtml + '*.html']);
	let sources = gulp.src([paths.distJs + '*.js', paths.distCss + '*.css'], {
		read: false
	});

	return target.pipe(inject(sources, {
			relative: true
		}))
		.pipe(gulp.dest(paths.dist))

}));

gulp.task('default', gulp.series(gulp.parallel('vendors', 'plugins', ), 'sass', 'inject', 'watch'));

gulp.task('build', gulp.series(gulp.parallel('vendors', 'plugins', ), 'sass', gulp.parallel('build-css', 'build-js', 'build-img'), gulp.parallel('build-html', 'build-php'), 'build-inject'));
