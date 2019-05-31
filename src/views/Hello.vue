<template>
    <div class="container">
        <vueCalendar :sundayStart="isSundayStart" v-on:click-date="clickDate"/>
        Hello vue-calendar
    </div>
</template>

<script>
import vueCalendar from "@/components/vue-calendar-component";
export default {
    name: "",
    data() {
        return {
            isSundayStart:false,
        };
    },
    components: {
        vueCalendar
    },
    methods:{
        clickDate(date){
            console.log(date)
        }
    }
};
</script>

<style scoped>
</style>
