$(document).ready(function() {

    var util = {
        loadMdsIds: function() {

        }
    };

    // Landing page

    // MDS Manager page
    $('#mds-table').DataTable({
        columns: [
            { 
                searchable: false, 
                sortable: false, 
                width: "40px" 
            },
            { 
                searchable: true 
            },
            { 
                searchable: false, 
                width: "180px" 
            },
            { 
                searchable: true, 
                width: "120px" 
            },
        ],
        paging: false,
        searching: false,
    });

} );