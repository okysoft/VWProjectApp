/**
 * Created by Intarget on 28/09/2014.
 */
var app = angular.module('VWApp',[]);

app.controller('TabCtrl', function($scope){
    $scope.tab = 1;

    $scope.selectTab = function(setTab)
    {
        $scope.tab = setTab;
    };
    $scope.isSelected = function(checkTab)
    {
        return $scope.tab === checkTab;
    };
});

app.controller('MenuCtrl', function($scope){

    $scope.modules = [{id: 1, src:'img/home.png', displayText: 'Home'},
        {id: 2, src:'img/reportes.png', displayText: 'Reportes'},
        {id: 3, src:'img/graficas.png', displayText: 'Graficas'},
        {id: 4, src:'img/telefono.png', displayText: 'Audios'},
        {id: 5, src:'img/upload.png', displayText: 'Carga'},
        {id: 6, src:'img/password.png', displayText: 'Password'},
        {id: 7, src:'img/config.png', displayText: 'Configuración'}];
    $scope.segment = 1;
    $scope.menuClick = function( option ) {
        $scope.segment = option;
    };
});

app.controller("ModuleCtrl", function ($scope) {
    $scope.module = {};

});

app.controller("UploadBD",function($scope)
{
    $scope.filesChanged = function (elm) {
        $scope.files= elm.files;
        $scope.$apply();
    };

    $scope.upload = function()
    {
        if($scope.files != undefined){
            var reader = new FileReader();
            var file = $scope.files[0];

            function to_json(workbook) {
                var result = {};
                workbook.SheetNames.forEach(function(sheetName) {
                    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    if(roa.length > 0){
                        result[sheetName] = roa;
                    }
                });
                return result;
            }

            reader.onload = function(e) {
                var data = e.target.result;
                //var wb = XLSX.read(data, {type: 'binary'});
                var arr = String.fromCharCode.apply(null, new Uint8Array(data));
                var wb = XLSX.read(btoa(arr), {type: 'base64'});
                $scope.cBase = to_json(wb);
            };
            //reader.readAsBinaryString(f);
            reader.readAsArrayBuffer(file);
        }
    };
});