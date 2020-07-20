
if(window.location.protocol != 'https:' && window.location.protocol != 'file:') {
  location.href = location.href.replace("http://", "https://").replace("www.", "");
}


(function() {
    try{
   // When the user scrolls the page, execute myFunction 
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("sticky-navbar");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    
        if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
    
}

} catch(e)
    {

    }
  

})();




new Vue({
    el: '#app',
    data: {
        whereActive:'platform',
        featurefeatures: 'objects',
        feature: 'developers',
        dev_code_example:'anatomy',
        registrationEmail: '',
        openedObjectRole: 'object',
        openedFeature : 'api',
        openedPropertyType : 'shortText',
        registrationEmailSent: false,
        registrationComplete: false,
        registration: {
        	registrationKey: null,
        	clientname:null,
        	username:null,
        	password:null
        },
        globalApplications: []
    },
    methods: {
        requestKey: function(email) {
            var self = this;
            var spoo = new Client().NewClient().RequestKey(email).add(function(data, err) {
                if (err) {
                    alert('Error');
                    return;
                }
                self.registrationEmailSent = true;
            });
        },
        getParameterByName: function(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },

        registerClient: function(registrationKey, clientName, username, password)
        {
        	var self = this;
            var spoo = new Client().NewClient({registrationKey: registrationKey, clientname: clientName, username : username, password: password}).add(function(data, err) {
                if (err) {

                    alert('Error: ' + data.error);
                    console.debug(err);
                    console.debug(data);
                    return;
                }
                self.registrationComplete = true;
            });
        },
        loadGlobalApplications: function(q) {
            var self = this;
            var query = {};

            if(q)
              query['displayName'] = '/' + q + '/';
            else query = {};

            new SpooGlobal().Applications(query).get(function(data, err) {
                if (err) {
                    return;
                }
                
                self.globalApplications = data;
            })
        },
    },
    created: function() {
    	if(this.getParameterByName('registrationKey') != null)
        	this.registration.registrationKey = this.getParameterByName('registrationKey');

        //this.loadGlobalApplications();
    }
})