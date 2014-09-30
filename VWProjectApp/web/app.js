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
    $scope.dataLoading = false;
    $scope.fileType = 2;
    $scope.show = true;
    $scope.casuisticaAnalisis = {};
    $scope.bdUpload = {};

    $scope.change= function(option){
        //$scope.fileType = option;
        //$scope.show = false;
    };

    $scope.filesChanged = function (elm) {
        $scope.files= elm.files;
        if($scope.files != undefined){
            var reader = new FileReader();
            var file = $scope.files[0];
            $scope.casuisticaAnalisis.nombreArchivo = file.name;
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
            /*function _arrayBufferToBase64( buffer ) {
                var binary = '';
                var bytes = new Uint8Array( buffer );
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode( bytes[ i ] );
                }
                return btoa( binary );
            }*/

            reader.onload = function(e) {
                var data = e.target.result;
                var wb = XLSX.read(data, {type: 'binary'});
                //var arr = String.fromCharCode.apply(null, new Uint8Array(data));
                //var wb = XLSX.read(btoa(arr), {type: 'base64'});
                $scope.cBase = to_json(wb);
                $scope.uploadAnalisis();
                $scope.dataLoading = false;
                $scope.$apply();
            };
            //reader.readAsBinaryString(f);
            $scope.dataLoading = true;
            reader.readAsArrayBuffer(file);
        }
        $scope.$apply();
    };

    $scope.uploadAnalisis = function()
    {
           //Configuracion
        $scope.casuisticaAnalisis.compilador = $scope.cBase.Config[0].Compilador;
        $scope.casuisticaAnalisis.fecha = $scope.cBase.Config[0].Fecha;
        $scope.casuisticaAnalisis.medicion = $scope.cBase.Config[0].Medición;
        $scope.casuisticaAnalisis.version = $scope.cBase.Config[0].Versión;

        //Base


        $scope.casuisticaAnalisis.totalRegistros = $scope.cBase.Base.length;
        $scope.casuisticaAnalisis.totalConcesionarios =  Enumerable.From($scope.cBase.Base)
            .Distinct(function(x){ return x.No_Concesionario })
            .Where(function(x){return x.No_Concesionario!= undefined})
            .Select(function (x) {
                var concesionario = {};
                concesionario.No_Concesionario = x.No_Concesionario
                return concesionario})
            .ToArray().length;

        $scope.casuisticaAnalisis.totalFunicos =  Enumerable.From($scope.cBase.Base)
            .Distinct(function(x){ return x.FUNICO })
            .Where(function(x){return x.FUNICO!= undefined})
            .Select(function (x) {
                var registro = {};
                registro.FUNICO = x.FUNICO
                return registro})
            .ToArray().length;

        $scope.casuisticaAnalisis.totalTelefonosRegistrados =  Enumerable.From($scope.cBase.Base)
            .Where(function(x){return x.Telefono1!= undefined})
            .Select(function (x) {
                var registro = {};
                registro.Telefono1 = x.Telefono1
                return registro})
            .ToArray().length;

        $scope.casuisticaAnalisis.totalEmail =  Enumerable.From($scope.cBase.Base)
            .Where(function(x){return x.Mail!= undefined})
            .Select(function (x) {
                var registro = {};
                registro.Mail = x.Mail
                return registro})
            .ToArray().length;

        $scope.casuisticaAnalisis.totalEmail2 =  Enumerable.From($scope.cBase.Base)
            .Where(function(x){return x.Mail2!= undefined})
            .Select(function (x) {
                var registro = {};
                registro.Mail2 = x.Mail2
                return registro})
            .ToArray().length;

        $scope.casuisticaAnalisis.totalEmail2 =  Enumerable.From($scope.cBase.Base)
            .Where(function(x){return x.Mail2!= undefined})
            .Select(function (x) {
                var registro = {};
                registro.Mail2 = x.Mail2
                return registro})
            .ToArray().length;

        $scope.casuisticaAnalisis.totalAsesores =  Enumerable.From($scope.cBase.Base)
            .Distinct(function(x){ return x.CURPAsesor })
            .Where(function(x){return x.CURPAsesor!= undefined})
            .Select(function (x) {
                var registro = {};
                registro.CURPAsesor = x.CURPAsesor
                return registro})
            .ToArray().length;

        $scope.casuisticaAnalisis.totalTecnicos =  Enumerable.From($scope.cBase.Base)
            .Distinct(function(x){ return x.Tecnico })
            .Where(function(x){return x.Tecnico!= undefined})
            .Select(function (x) {
                var registro = {};
                registro.Tecnico = x.Tecnico
                return registro})
            .ToArray().length;

        $scope.show = true;
        $scope.$apply();
    };

});