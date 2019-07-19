

// 安装插件
Vue.use(VueRouter);

// 创建路由对象
var myrouter = new VueRouter(
    {
        // 如果在创建 VueRouter 对象的时候不加这一句
        // 无法通过 this.$route 获取到地址栏的参数
        mode: 'history',
    }
);

var nav =
    new Vue({
        el: '#nav',
        data: {
            message: 'Hello Vue!',
            is_login: false,
            userinfo: {},
            login_url: null
        },
        router: myrouter,
        methods: {
            getUserInfo() {

                var user_id = this.$route.query.id;
                var username = this.$route.query.username;
                var head_img = this.$route.query.head_img;

                if (username != null && user_id != null && head_img != null) {
                    this.is_login = true;
                    this.userinfo.username = username;
                    this.userinfo.user_id = user_id;
                    this.userinfo.head_img = head_img;

                    localStorage.setItem("username", username);
                    localStorage.setItem("user_id", user_id);
                    localStorage.setItem("head_img", head_img);
                    return;
                }

                username = localStorage.getItem("username")
                user_id = localStorage.getItem("user_id")
                head_img = localStorage.getItem("head_img")

                if (username != null && user_id != null && head_img != null) {
                    this.is_login = true;
                    this.userinfo.username = username;
                    this.userinfo.user_id = user_id;
                    this.userinfo.head_img = head_img;
                }
            },
            getLoginUrl() {

                if (this.is_login) {
                    return;
                }

                var that = this;
                axios.get('http://127.0.0.1:8080/pub/api/v1/get_login_url', {
                    params: {
                        state: 'http://127.0.0.1'
                    }
                })
                    .then(function (response) {
                        that.login_url = response.data.data;
                        console.log(that.login_url);
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });

            }
        },
        mounted() {
            this.getUserInfo();
            this.getLoginUrl();
        }
    })

var app = new Vue({
    el: '#app',
    data: {
        videos: [],
    },
    methods: {
        getVideoList() {
            var that = this;
            axios.get('http://127.0.0.1:8080/api/v1/video/list')
                .then(function (response) {
                    that.videos = response.data.data
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        },
        addOrder(index) {
            console.log(this.videos[index]);
            var userId = localStorage.getItem("user_id");
            var video = this.videos[index];
            var url = 'http://127.0.0.1:8080/api/v1/video_order/add?user_id=' + userId + '&video_id=' + video.id;
            Vue.set(video , 'addOrderUrl' , url);
        }
    },
    mounted() {
        this.getVideoList();
    }
})