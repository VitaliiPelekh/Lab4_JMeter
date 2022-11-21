/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 94.58689458689459, "KoPercent": 5.413105413105413};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9044321329639889, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, ""], "isController": true}, {"data": [1.0, 500, 1500, "-280"], "isController": false}, {"data": [1.0, 500, 1500, "-282"], "isController": false}, {"data": [1.0, 500, 1500, "-281"], "isController": false}, {"data": [1.0, 500, 1500, "-277"], "isController": false}, {"data": [1.0, 500, 1500, "-299"], "isController": false}, {"data": [1.0, 500, 1500, "-298"], "isController": false}, {"data": [1.0, 500, 1500, "-279"], "isController": false}, {"data": [1.0, 500, 1500, "-278"], "isController": false}, {"data": [1.0, 500, 1500, "-295"], "isController": false}, {"data": [0.0, 500, 1500, "-272"], "isController": false}, {"data": [1.0, 500, 1500, "-294"], "isController": false}, {"data": [1.0, 500, 1500, "-296"], "isController": false}, {"data": [1.0, 500, 1500, "-291"], "isController": false}, {"data": [1.0, 500, 1500, "-290"], "isController": false}, {"data": [1.0, 500, 1500, "-293"], "isController": false}, {"data": [1.0, 500, 1500, "-292"], "isController": false}, {"data": [1.0, 500, 1500, "-288"], "isController": false}, {"data": [1.0, 500, 1500, "-287"], "isController": false}, {"data": [1.0, 500, 1500, "-301"], "isController": false}, {"data": [1.0, 500, 1500, "-289"], "isController": false}, {"data": [1.0, 500, 1500, "-300"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "-284"], "isController": false}, {"data": [1.0, 500, 1500, "-283"], "isController": false}, {"data": [1.0, 500, 1500, "-286"], "isController": false}, {"data": [1.0, 500, 1500, "-285"], "isController": false}, {"data": [0.95, 500, 1500, "-306"], "isController": false}, {"data": [1.0, 500, 1500, "-303"], "isController": false}, {"data": [1.0, 500, 1500, "-302"], "isController": false}, {"data": [1.0, 500, 1500, "-305"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 351, 19, 5.413105413105413, 132.19373219373227, 39, 1236, 78.0, 265.40000000000003, 387.1999999999998, 1012.400000000001, 64.12130069419072, 840.9721310399159, 68.33814538043478], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["", 10, 10, 100.0, 4141.8, 3719, 4819, 4125.0, 4800.1, 4819.0, 4819.0, 1.8145527127563057, 733.7049976751043, 59.38017431046997], "isController": true}, {"data": ["-280", 16, 0, 0.0, 89.1875, 69, 131, 85.0, 126.10000000000001, 131.0, 131.0, 3.82866714525006, 5.340364396386695, 1.9638744316822205], "isController": false}, {"data": ["-282", 14, 0, 0.0, 86.64285714285714, 71, 133, 80.0, 124.0, 133.0, 133.0, 3.437269825681316, 4.774918288116867, 1.6872257089369014], "isController": false}, {"data": ["-281", 18, 0, 0.0, 104.55555555555554, 69, 419, 90.0, 147.20000000000044, 419.0, 419.0, 4.261363636363636, 5.96780487985322, 2.2696292761600376], "isController": false}, {"data": ["-277", 19, 0, 0.0, 188.1578947368421, 63, 496, 206.0, 459.0, 496.0, 496.0, 4.022866821935211, 5.752062711729833, 2.1584450428752913], "isController": false}, {"data": ["-299", 10, 0, 0.0, 48.3, 44, 56, 47.0, 55.6, 56.0, 56.0, 16.89189189189189, 6.317963471283784, 32.65050939611486], "isController": false}, {"data": ["-298", 10, 0, 0.0, 74.3, 44, 300, 48.5, 275.9000000000001, 300.0, 300.0, 17.123287671232877, 6.404510916095891, 19.486100706335616], "isController": false}, {"data": ["-279", 19, 0, 0.0, 85.10526315789474, 72, 139, 82.0, 103.0, 139.0, 139.0, 4.363803399173174, 6.061909666398714, 2.349895570165365], "isController": false}, {"data": ["-278", 19, 0, 0.0, 77.6842105263158, 68, 89, 78.0, 88.0, 89.0, 89.0, 4.389004389004389, 6.0547326172326175, 2.3591800935550937], "isController": false}, {"data": ["-295", 10, 0, 0.0, 100.5, 47, 349, 49.5, 340.1, 349.0, 349.0, 13.003901170351105, 4.863763816644993, 20.04302462613784], "isController": false}, {"data": ["-272", 19, 19, 100.0, 74.52631578947368, 39, 120, 86.0, 105.0, 120.0, 120.0, 3.9823936281701946, 1.2864588791657934, 4.2157370048207925], "isController": false}, {"data": ["-294", 10, 0, 0.0, 97.5, 43, 281, 53.5, 280.0, 281.0, 281.0, 12.658227848101266, 4.734473892405063, 14.924100079113924], "isController": false}, {"data": ["-296", 10, 0, 0.0, 89.60000000000001, 45, 414, 56.0, 378.5000000000001, 414.0, 414.0, 12.642225031605562, 4.728488463969659, 14.374358012010113], "isController": false}, {"data": ["-291", 10, 0, 0.0, 101.1, 64, 263, 79.5, 250.40000000000003, 263.0, 263.0, 12.269938650306749, 83.60812883435584, 12.752827837423315], "isController": false}, {"data": ["-290", 10, 0, 0.0, 101.6, 49, 280, 61.0, 278.6, 280.0, 280.0, 12.5, 9.521484375, 13.272705078125], "isController": false}, {"data": ["-293", 10, 0, 0.0, 50.5, 45, 63, 49.5, 62.2, 63.0, 63.0, 12.886597938144329, 4.819889658505154, 14.413106072809278], "isController": false}, {"data": ["-292", 10, 0, 0.0, 124.9, 83, 419, 93.0, 387.5000000000001, 419.0, 419.0, 12.180267965895249, 15.12303973812424, 34.74825860231425], "isController": false}, {"data": ["-288", 10, 0, 0.0, 51.1, 47, 56, 51.0, 55.9, 56.0, 56.0, 18.34862385321101, 6.862815366972477, 53.5102494266055], "isController": false}, {"data": ["-287", 10, 0, 0.0, 124.10000000000001, 98, 144, 127.0, 143.6, 144.0, 144.0, 15.479876160990711, 20.320360874613, 16.40655234133127], "isController": false}, {"data": ["-301", 10, 0, 0.0, 355.59999999999997, 322, 384, 356.5, 383.2, 384.0, 384.0, 10.857763300760043, 2043.1892983170467, 9.023395086862106], "isController": false}, {"data": ["-289", 10, 0, 0.0, 106.80000000000001, 46, 392, 48.0, 382.5, 392.0, 392.0, 12.01923076923077, 4.495474008413462, 34.93441068209135], "isController": false}, {"data": ["-300", 10, 0, 0.0, 68.5, 61, 81, 68.0, 80.3, 81.0, 81.0, 16.233766233766232, 23.139458198051948, 21.026214995941558], "isController": false}, {"data": ["-284", 13, 0, 0.0, 774.0769230769231, 155, 1076, 936.0, 1062.0, 1076.0, 1076.0, 3.2524393294971228, 537.91833132662, 3.0572245590442835], "isController": false}, {"data": ["-283", 13, 0, 0.0, 86.46153846153845, 74, 135, 78.0, 129.0, 135.0, 135.0, 3.3121019108280256, 4.578523089171974, 1.5801652070063694], "isController": false}, {"data": ["-286", 10, 0, 0.0, 88.69999999999999, 77, 128, 83.5, 124.80000000000001, 128.0, 128.0, 16.0, 23.43125, 22.4890625], "isController": false}, {"data": ["-285", 11, 0, 0.0, 53.18181818181818, 47, 63, 51.0, 62.6, 63.0, 63.0, 3.7351443123938877, 1.3970315152801358, 4.527668718166384], "isController": false}, {"data": ["-306", 10, 0, 0.0, 302.20000000000005, 179, 1236, 192.0, 1137.2000000000003, 1236.0, 1236.0, 6.666666666666667, 80.705078125, 4.114583333333333], "isController": false}, {"data": ["-303", 10, 0, 0.0, 51.3, 43, 59, 50.5, 59.0, 59.0, 59.0, 16.051364365971107, 175.82827548154094, 16.552969502407706], "isController": false}, {"data": ["-302", 10, 0, 0.0, 55.2, 47, 66, 53.5, 65.6, 66.0, 66.0, 16.233766233766232, 6.071809050324675, 19.773805296266232], "isController": false}, {"data": ["-305", 10, 0, 0.0, 210.4, 184, 228, 212.5, 226.9, 228.0, 228.0, 12.72264631043257, 2.82035225826972, 5.205848441475827], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 19, 100.0, 5.413105413105413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 351, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["-272", 19, 19, "404/Not Found", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
