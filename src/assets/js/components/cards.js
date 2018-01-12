Vue.component("card", {
    template: `

   
        <div class="card">
            <div class="card-content"> 
                <div class="content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </div>
            </div>
        </div>

    `,
    data(){
        return {test:[]};
    },
    created(){
        
    },
    methods:{
        
    }
});

new Vue({
    el:".app"
})