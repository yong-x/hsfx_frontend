/*下面配置为vant官方推荐配置*/
const autoprefixer = require('autoprefixer'); //css自动添加前缀插件
const pxtorem = require('postcss-pxtorem'); //自动将px转化为rem插件
module.exports = {
	outputDir: 'dist', //项目构建时的输出目录，此项默认值为dist
	css: {
		// modules:false,
		// extract:true,
		sourceMap: false,
		loaderOptions: { //配置处理css的loader，loader类型有css-loader、less-loader、 postcss-loader等等。
			postcss: { //postcss-loader样式处理插件配置，将程序员写的css编译为更高效更兼容的css代码
				plugins: [
					autoprefixer(),  //自动给css代码添加浏览器供应商前缀，增强兼容性
						
					
					pxtorem({ 		//自动将px像素单位转化为rem
						rootValue: 37.5,
						selectorBlackList: ['vant', 'mu'], // 忽略转换正则匹配项
						propList: ['*']
					})
				]
			}
		}
	}
}
