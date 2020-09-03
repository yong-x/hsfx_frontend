module.exports = { //babel.config中的配置内容主要实现自动按需引入外部组件的作用
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
  	  // 下面的配置作用是可以实现按需引入vant组件，将 import {xxx} from 'vant' 引入xxx组件在其它组件使用。
  	  //如果不进行下面的配置则要手动分别引入，非常麻烦，例如 import Button from 'vant/lib/button'; import 'vant/lib/button/style'; 之后才可以使用button组件。
      ['import', {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      }, 'vant']
    ]
}
