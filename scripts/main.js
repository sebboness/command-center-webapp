$(document).ready(function() {

    var util = {
        populateMdsCountryFilter: function(countries) {
            $('#mdsCountryFilter').select2({
                data: countries.map(function(x) {
                    return {
                        id: x,
                        text: 'Country - ' + x,
                    };
                }),
                theme: "bootstrap",
            });

            $('#mdsCountryFilter').on('select2:select', function (e) {
                var data = e.params.data;
                mdsTable
                    .column(2)
                    .search(data.id, true, true)
                    .draw();
                
            });
        },

        populateMdsDocTypeFilter: function(data) {
            var $options = $('[aria-labelledby="mdsDocTypeFilter"]');

            $options.append('<a class="dropdown-item filter-by" data-btn="#mdsDocTypeFilter" data-type="Document Type" data-col="4" data-val="" href="#">All</a>')

            for (var i = 0; i < data.length; i++) {
                if (!data[i])
                    continue; // skip empty (for now)

                $options.append('<a class="dropdown-item filter-by" data-btn="#mdsDocTypeFilter" data-type="Document type" data-col="4" data-val="' + data[i] + '" href="#">' + data[i] + '</a>')
            }
        },
        
        populateMdsRegionFilter: function(countries) {
            $('#mdsRegionFilter').select2({
                data: countries.map(function(x) {
                    return {
                        id: x.substr(4),
                        text: 'Region - ' + x,
                    };
                }),
                theme: "bootstrap",
            });

            $('#mdsRegionFilter').on('select2:select', function (e) {
                var data = e.params.data;
                mdsTable
                    .column(3)
                    .search(data.id, true, true)
                    .draw();
                
            });
        }
    };

    // Landing page

    // MDS Manager page
    $('#mdsCountryFilter').select2({
        theme: "bootstrap"
    });

    // MDS table
    var mdsTable = $('#mds-table').DataTable({
        ajax: {
            url: "/scripts/mds-data.json",
            dataSrc: function ( json ) {
                var mdsCountries = [];
                var mdsRegions = [];
                var mdsDocTypes = [];

                // populate distinct countries, regions, docTypes
                for ( var i=0, ien=json.length ; i<ien ; i++ ) {
                    var mdsParts = json[i].mdsId.split('.');
                    var country = mdsParts[3];
                    var region = mdsParts[4];
                    var docType = mdsParts[5];

                    if (region)
                        region = country + '-' + region;

                    json[i].country = country;
                    json[i].region = region;
                    json[i].docType = docType;
                    
                    if (mdsCountries.indexOf(country) == -1)
                        mdsCountries.push(country);
                    if (mdsRegions.indexOf(region) == -1)
                        mdsRegions.push(region);
                    if (mdsDocTypes.indexOf(docType) == -1)
                        mdsDocTypes.push(docType);
                }

                mdsCountries = mdsCountries.sort();
                mdsRegions = mdsRegions.sort();
                mdsDocTypes = mdsDocTypes.sort();

                util.populateMdsCountryFilter(mdsCountries);
                util.populateMdsDocTypeFilter(mdsDocTypes);
                util.populateMdsRegionFilter(mdsRegions);

                return json;
            },
        },
        columns: [
            { 
                data: "checked",
                searchable: false, 
                sortable: false,
                targets: 0,
                width: "40px",
                render: function (data, type, row, meta) {
                    return '<input class="mds-row-check" type="checkbox" ' + (data ? "checked" : "") + ' value="' + row.mdsId + '" />';
                }
            },
            { 
                data: "mdsId",
                searchable: true,
                targets: 1
            },
            { 
                data: "country",
                searchable: true,
                targets: 2
            },
            { 
                data: "region",
                searchable: true,
                targets: 3,
                render: function (data, type, row, meta) {
                    return data && data.length > 4 ? (data.substr(4)) : '';
                }
            },
            { 
                data: "docType",
                searchable: true,
                targets: 4
            },
            { 
                data: "updatedOn",
                searchable: false,
                targets: 5, 
                width: "180px",
                render: function (data, type, row, meta) {
                    return moment(data * 1000).format('MM/DD/YYYY HH:mm a');
                }
            },
            { 
                data: "status",
                searchable: true,
                targets: 6, 
                width: "120px" 
            },
        ],
        dom: "<'row'<'col'i>>" +
             "<'row'<'col-sm-12'tr>>" +
             "<'row'<'col'p>>", // See https://datatables.net/reference/option/dom (Bootstrap 4 section)
        order: [[1, 'asc']]
    });

    // Setup mds filter
    $(document).on('click', '.filter-by', function(e) {
        var filterCol = parseInt($(this).data('col'));
        var filterVal = $(this).data('val');
        var type = $(this).data('type');
        var $btn = $($(this).data('btn'));

        if ($btn)
            $btn.text(type + (filterVal ? (' - ' + filterVal) : ''));

        mdsTable
            .column(filterCol)
            .search(filterVal, true, true)
            .draw();
    });

    // Setup mds show entries
    $(document).on('click', '.entries', function(e) {
        var label = $(this).text();
        var len = parseInt($(this).data('len'));
        var $btn = $($(this).data('btn'));

        if ($btn)
            $btn.text(label);

        mdsTable
            .page
            .len(len)
            .draw();
    });

    // Setup mds search
    var mdsSearchTimout = undefined;
    $('#mds-search').on('input', function(e) {
        var $this = $(this);

        if (mdsSearchTimout)
            clearTimeout(mdsSearchTimout);

        mdsSearchTimout = setTimeout(function() {
            var search = $this.val();
            // Perform search if search string is 2 or more chars
            if (search && search.length >= 2) {            
                console.log('searching', $this.val());
                mdsTable
                    .search($this.val())
                    .draw();
            }
            else {
                mdsTable
                    .search('')
                    .draw();
            }
        }, 375);
    });

    $('#search-clear-btn').on('click', function(e) {
        $('#mds-search').val('');
        mdsTable
            .search('')
            .draw();
    });

} );