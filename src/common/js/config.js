require.config({
	baseUrl: './', 
	urlArgs: new Date().getTime(),
	optimize: "none",  //默认值optimize: "uglify", uglify会报错 
	paths: {
		jquery: './common/lib/jquery',
		custom: './common/js/custom',
		amfe: './common/lib/amfe-flexible'
	}
	// 设置依赖
	// shim: {
	// 	bootstrap: {
	// 		deps: ['jquery']
	// 	}
	// },
	//不打包的静态文件
	// excludeShallow: ['jquery'],
	// name: 'entry',
	// out: './dist/'
})
