$(document).ready(function() {

    // Landing page

    // MDS Manager page
    $('#mds-table').DataTable({
        columns: [
            { searchable: true },
            { searchable: true },
        ],
        paging: false,
        searching: false,
    });
} );