
const demo1 = () => {
    let data = {
        content: ''
    }
    
    let el = {
        title: document.querySelector('.title-1'),
        input: document.querySelector('.input-1')
    }
    
    Object.defineProperty(data,'content',{
        get(){
            return el.title.innerHTML
        },
        set(val){
            el.input.value = val
            el.title.innerHTML = val
        }
    })

    el.input.addEventListener('keyup',(e)=>{
        data.content = e.target.value
    })
}

const demo2 = () => {
    let data = {
        content: ""
      };
      
      let el = {
        title: document.querySelector(".title-2"),
        input: document.querySelector(".input-2")
      };
      
      data = new Proxy(data, {
        get(target, property, receiver) {
          return Reflect.get(target, property, receiver);
        },
        set(target, property, value, receiver) {
          el.input.value = value;
          el.title.innerHTML = value;
          return Reflect.set(...arguments);
        }
      });
      
      el.input.addEventListener("keyup", (e) => {
        data.content = e.target.value;
      });      
}

const demo3 = () => { 
    class Vue{
        constructor(options){
          const vm = this
          vm.$el = document.querySelector(options.el)
          vm.$methods = options.methods
          let data = options.data
          data = vm._data = typeof data === "function" ? data.call(vm,vm) : data || {}
          vm._binding = {}
          vm._observer(data)
          vm._compile(vm.$el)
        }
        _pushWatcher(watcher){
          if(!this._binding[watcher.key]){
            this._binding[watcher.key] = []
          }
          this._binding[watcher.key].push(watcher)
        }
        _observer(data){
          const vm = this
          const handler = {
            set(target,property,value){
              const res = Reflect.set(...arguments)
              vm._binding[property].map(item => {
                // 调用指定方法，更新视图
                item.update()
              })
              return res
            }
          }
          vm._data = new Proxy(data,handler)
        }
        _compile(root){
          const nodes = [...root.children]
          const data = this._data
          nodes.map(node => {
            if(node.children && node.children.length){
              this._compile(node.children)
            }
            const $input = node.tagName.toLowerCase() === 'input'
            const $textarea = node.tagName.toLowerCase() === 'textarea'
            const $vmodel = node.hasAttribute('v-model')
            if($vmodel && ($input || $textarea)){
               const key = node.getAttribute('v-model')
               this._pushWatcher(new Watcher(node,'value',data,key))
               node.addEventListener('input',() =>{
                  data[key] = node.value
               })
            }
            if(node.hasAttribute('v-bind')){
               const key = node.getAttribute('v-bind')
               this._pushWatcher(new Watcher(node,'innerHTML',data,key))
            }
            if(node.hasAttribute('@click')){
              const name = node.getAttribute('@click')
              const method = this.$methods[name].bind(data)
              node.addEventListener('click',method)
            }
          })
        }
      }
      
      class Watcher{
        constructor(node,attr,data,key){
          this.node = node
          this.attr = attr
          this.data = data
          this.key = key
          this.update() // 将视图初始化
        }
        update(){
          let value = Reflect.get(this.data,this.key)
          Reflect.set(this.node,this.attr,value)
        }
      }
      
      const count = 99
      
      new Vue({
        el: "#my-app",
        data(){
          return{
            count: count
          }
        },
        methods:{
          add(){
            this.count++
          },
          reduce(){
            this.count--
          },
          reset(){
            this.count = count
          }
        }
      })
}


window.onload = function () { 
    demo1() // 通过 Object.defineProperty 实现双向绑定。
    demo2() // 通过 Proxy 实现双向绑定。
    demo3() // 通过 Vue 实现双向绑定。
}()