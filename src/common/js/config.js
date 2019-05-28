require.config({
	baseUrl: './src/',
	urlArgs: new Date().getTime(),
	optimize: "none",
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
