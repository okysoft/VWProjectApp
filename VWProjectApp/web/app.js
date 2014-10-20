/**
/**
 * Created by Intarget on 28/09/2014.
 */
var app = angular.module('VWApp',[]);


app.controller('TestWS', function($scope){
    $scope.testWS = function () {
        {
            var ws = new WebSocket("ws://localhost:9001");
            ws.onopen = function()
            {
                var data = {Name: 'intarget', UserName:'intarget',Password:'intarget'};
                var text = JSON.stringify(data);
                // Web Socket is connected, send data using send()
                ws.send("LOGIN " + text);
                alert("Message is sent...");
            };
            ws.onmessage = function (evt)
            {
                var received_msg = evt.data;
                alert("Message is received...");
            };
            ws.onclose = function()
            {
                // websocket is closed.
                alert("Connection is closed...");
            };
            ws.onerror = function(e, msg)
            {
                alert(e.message);
            }
        }
    }
});

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

app.controller('MenuCtrl', function($scope, $rootScope){

    $rootScope.wsURL = "ws://localhost:9096//websocket";
    //$rootScope.wsURL = "ws://173.248.133.19:9096//websocket";

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

app.controller("UploadBD",function($scope, $rootScope)
{
    $scope.dataLoading = false;
    $scope.fileType = 0;
    $scope.show = false;
    $scope.casuisticaAnalisis = {};
    $scope.audiosVentasPasajeros = {};
    $scope.audiosServicioPasajeros = {};
    $scope.bdUpload = {};

    $scope.procesar = function(type)
    {
        switch(type)
        {
            case 1:

                break;
        }

    }

    $scope.change= function(option){
        $scope.fileType = option;
        $scope.show = false;
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
                $scope.uploadAnalisis($scope.fileType);
                $scope.dataLoading = false;
                $scope.$apply();
            };
            //reader.readAsBinaryString(f);
            $scope.dataLoading = true;
            reader.readAsArrayBuffer(file);
        }
        $scope.$apply();
    };

    $scope.uploadAnalisis = function(type)
    {
        //Configuracion
        $scope.casuisticaAnalisis.compilador = $scope.cBase.Config[0].Compilador;
        $scope.casuisticaAnalisis.fecha = $scope.cBase.Config[0].Fecha;
        $scope.casuisticaAnalisis.medicion = $scope.cBase.Config[0].Medición;
        $scope.casuisticaAnalisis.version = $scope.cBase.Config[0].Versión;

        if(type == 1) {

            //Base
            $scope.casuisticaAnalisis.totalRegistros = $scope.cBase.Base.length;
            $scope.casuisticaAnalisis.totalConcesionarios = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.No_Concesionario
                })
                .Where(function (x) {
                    return x.No_Concesionario != undefined
                })
                .Select(function (x) {
                    var concesionario = {};
                    concesionario.No_Concesionario = x.No_Concesionario
                    return concesionario
                })
                .ToArray().length;

            $scope.casuisticaAnalisis.totalFunicos = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.FUNICO
                })
                .Where(function (x) {
                    return x.FUNICO != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.FUNICO = x.FUNICO
                    return registro
                })
                .ToArray().length;

            $scope.casuisticaAnalisis.totalTelefonosRegistrados = Enumerable.From($scope.cBase.Base)
                .Where(function (x) {
                    return x.Telefono1 != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.Telefono1 = x.Telefono1
                    return registro
                })
                .ToArray().length;

            $scope.casuisticaAnalisis.totalEmail = Enumerable.From($scope.cBase.Base)
                .Where(function (x) {
                    return x.Mail != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.Mail = x.Mail
                    return registro
                })
                .ToArray().length;

            $scope.casuisticaAnalisis.totalEmail2 = Enumerable.From($scope.cBase.Base)
                .Where(function (x) {
                    return x.Mail2 != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.Mail2 = x.Mail2
                    return registro
                })
                .ToArray().length;

            $scope.casuisticaAnalisis.totalEmail2 = Enumerable.From($scope.cBase.Base)
                .Where(function (x) {
                    return x.Mail2 != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.Mail2 = x.Mail2
                    return registro
                })
                .ToArray().length;

            $scope.casuisticaAnalisis.totalAsesores = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.CURPAsesor
                })
                .Where(function (x) {
                    return x.CURPAsesor != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.CURPAsesor = x.CURPAsesor
                    return registro
                })
                .ToArray().length;

            $scope.casuisticaAnalisis.totalTecnicos = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.Tecnico
                })
                .Where(function (x) {
                    return x.Tecnico != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.Tecnico = x.Tecnico
                    return registro
                })
                .ToArray().length;
        }
        else if(type == 2)
        {
            $scope.audiosVentasPasajeros.totalRegistros = $scope.cBase.Base.length;

            $scope.audiosVentasPasajeros.totalConcesionarios = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.Concesionaria
                })
                .Where(function (x) {
                    return x.Concesionaria != undefined
                })
                .Select(function (x) {
                    var concesionario = {};
                    concesionario.Concesionaria = x.Concesionaria
                    return concesionario
                })
                .ToArray().length;

            $scope.audiosVentasPasajeros.totalDIAKEYF = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.DIAKEYF
                })
                .Where(function (x) {
                    return x.DIAKEYF != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.DIAKEYF = x.DIAKEYF
                    return registro
                })
                .ToArray().length;

            $scope.audiosVentasPasajeros.totalChasis = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.chasis
                })
                .Where(function (x) {
                    return x.chasis != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.chasis = x.chasis
                    return registro
                })
                .ToArray().length;

            $scope.audiosVentasPasajeros.totalAudios = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x['Nombre del audio']
                })
                .Where(function (x) {
                    return x['Nombre del audio'] != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro['Nombre del audio'] = x['Nombre del audio']
                    return registro
                })
                .ToArray().length;

        }
        else if(type == 3)
        {
            $scope.audiosServicioPasajeros.totalRegistros = $scope.cBase.Base.length;

            $scope.audiosServicioPasajeros.totalConcesionarios = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.Concesionaria
                })
                .Where(function (x) {
                    return x.Concesionaria != undefined
                })
                .Select(function (x) {
                    var concesionario = {};
                    concesionario.Concesionaria = x.Concesionaria
                    return concesionario
                })
                .ToArray().length;

            $scope.audiosServicioPasajeros.totalID = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.ID
                })
                .Where(function (x) {
                    return x.ID != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.ID = x.ID
                    return registro
                })
                .ToArray().length;

            $scope.audiosServicioPasajeros.totalChasis = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x.chasis
                })
                .Where(function (x) {
                    return x.chasis != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro.chasis = x.chasis
                    return registro
                })
                .ToArray().length;

            $scope.audiosServicioPasajeros.totalAudios = Enumerable.From($scope.cBase.Base)
                .Distinct(function (x) {
                    return x['NOMBRE DEL AUDIO']
                })
                .Where(function (x) {
                    return x['NOMBRE DEL AUDIO'] != undefined
                })
                .Select(function (x) {
                    var registro = {};
                    registro['NOMBRE DEL AUDIO'] = x['NOMBRE DEL AUDIO']
                    return registro
                })
                .ToArray().length;

        }

        $scope.show = true;
        $scope.$apply();
    };

});

app.controller('ReportCtrl', function($scope, $rootScope){

    $scope.dataLoading = false;
    $scope.csColNames = [];
    $scope.csColNamesVentas = [];
    $scope.csColNamesReparaciones = [];
    $scope.agencias = [];
    $scope.agenciasVentas = [];
    $scope.agenciasReparaciones = [];
    $scope.bdData = [];
    $scope.bdDataVentas = [];
    $scope.bdDataReparacciones = [];

    $scope.showView = 0;
    $scope.fselection = 0;
    $scope.sselection = 0;

    $scope.ReturnAnterior = function (nivel) {
            $scope.showView = nivel;
    }

    $scope.ReturnPrincipal = function () {
        $scope.showView = 0;
    }

    $scope.FirtMenuSelect = function(option)
    {
        $scope.fselection = option;
        $scope.showView = 1;
    }

    $scope.SecondMenuSelect = function(option)
    {
        $scope.sselection = option;
        $scope.showView = 2;
    }

    $scope.FindMarcacion = function () {
        var property = "";
        var wherex = "";
        var valuex = $scope.searchs.dialvalue;
        switch (Number($scope.searchs.dialfilter)) {
            case 0  : property="STATUSEFECTIVO"; break;
            case 1  : property="VALIDADOS"; break;
            case 2  : property="AUTONOENTREGADO"; break;
            case 3  : property="AGREGARLISTANOLLAMAR"; break;
            case 4  : property="BARRERAIDIOMA"; break;
            case 5  : property="BUZON"; break;
            case 6  : property="COMUNICACIONDIFICIL"; break;
            case 7  : property="DIFICILLOCALIZAR"; break;
            case 8  : property="ENCUESTADO"; break;
            case 9  : property="EQUIVOCADO"; break;
            case 10  : property="FAXMODEM"; break;
            case 11 : property="FINADO"; break;
            case 12  : property="FUERASERVICIO"; break;
            case 13  : property="GARANTIAVENTAS"; break;
            case 14  : property="LLAMARTARDE"; break;
            case 15  : property="NASOBRECUOTA"; break;
            case 16  : property="NOCONTESTA"; break;
            case 17  : property="NOCONTESTOENCUESTA"; break;
            case 18  : property="NOENLAZATELEFONO"; break;
            case 19  : property="NOEXISTE"; break;
            case 20  : property="NOLEINTERESA"; break;
            case 21 : property="NOSEENCUENTRA"; break;
            case 22 : property="NOTERMINOENCUESTA"; break;
            case 23 : property="NUMERONODISPONIBLE"; break;
            case 24 : property="NUMERORESTRINGIDO"; break;
            case 25 : property="OCUPADO"; break;
            case 26 : property="SINEXTENSION"; break;
            case 27 : property="SINMARCAR"; break;
            case 28 : property="TELEFONOCONCESIONARIO"; break;
            case 29 : property="SERVICIONOREALIZADO"; break;
            case 30 : property="NOCOINCIDEMARCA"; break;

        }

        switch (Number($scope.searchs.dialwhere))
        {
            case 1:
                wherex = " == ";
                break;
            case 2:
                wherex = " < ";
                break;
            case 3:
                wherex = " > ";
                break;
        }




        var query = '$.'+property + ' ' + wherex + ' ' + valuex;
        var concecionario = Enumerable.From($scope.bdData)
            .Where(query)
            //.Where(function (x) { return x.DEALERID == $scope.searchs.dealerID })
            .Select(function (x) { return x })
            .ToArray();
        $scope.agencias = [];
        $scope.agencias = concecionario;
        $scope.$apply();

    }


    $scope.FindMarcacionVentas = function () {
        var property = "";
        var wherex = "";
        var valuex = $scope.searchs.dialvalueVentas;
        switch (Number($scope.searchs.dialfilterVentas)) {
            case 30 : property="STATUSEFECTIVO"; break;
            case 31 : property="AUTONOENTREGADO"; break;
            case 32 : property="AGREGARLISTANOLLAMAR"; break;
            case 33 : property="BARRERAIDIOMA"; break;
            case 34 : property="BUZON"; break;
            case 35 : property="COMUNICACIONDIFICIL"; break;
            case 36 : property="DIFICILLOCALIZAR"; break;
            case 37 : property="ENCUESTADO"; break;
            case 38 : property="EQUIVOCADO"; break;
            case 39 : property="FAXMODEM"; break;
            case 40 : property="FINADO"; break;
            case 41 : property="FUERASERVICIO"; break;
            case 42 : property="GARANTIAVENTAS"; break;
            case 43 : property="LLAMARTARDE"; break;
            case 44 : property="NASOBRECUOTA"; break;
            case 45 : property="NOCONTESTA"; break;
            case 46 : property="NOCONTESTOENCUESTA"; break;
            case 47 : property="NOENLAZATELEFONO"; break;
            case 48 : property="NOEXISTE"; break;
            case 49 : property="NOLEINTERESA"; break;
            case 50 : property="NOSEENCUENTRA"; break;
            case 51 : property="NOTERMINO"; break;
            case 52 : property="NUMERONODISPONIBLE"; break;
            case 53 : property="NUMERORESTRINGIDO"; break;
            case 54 : property="OCUPADO"; break;
            case 55 : property="SINEXTENSION"; break;
            case 56 : property="SINMARCAR"; break;
            case 57 : property="TELEFONOCONCESIONARIO"; break;
            case 58 : property="VENTANOREALIZADA"; break;
            case 59 : property="NOCOINCIDEMARCACONCESIONARA"; break;
        }

        switch (Number($scope.searchs.dialwhereVentas))
        {
            case 1:
                wherex = " == ";
                break;
            case 2:
                wherex = " < ";
                break;
            case 3:
                wherex = " > ";
                break;
        }

        var query = '$.'+property + ' ' + wherex + ' ' + valuex;
        var concecionario = Enumerable.From($scope.bdDataVentas)
            .Where(query)
            //.Where(function (x) { return x.DEALERID == $scope.searchs.dealerID })
            .Select(function (x) { return x })
            .ToArray();
        $scope.agenciasVentas = [];
        $scope.agenciasVentas = concecionario;
        $scope.$apply();

    }


    $scope.FindDFilterDep = function()
    {
        var property = "";
        var wherex = "";
        var valuex = $scope.searchs.depuvalue;
        switch (Number($scope.searchs.depufilter)) {
            case 0 : property="RECIBIDOS"; break;
            case 1 : property="APTOS"; break;
            case 2 : property="AGENCIACANCELADA"; break;
            case 3 : property="DUPLICADO"; break;
            case 4 : property="DUPLICADOBASEANTERIOR"; break;
            case 5 : property="DUPLICADOBASEEFECTIVA"; break;
            case 6 : property="EMPRESASINCONTACTO"; break;
            case 7 : property="ERRORFECHASERVICIO"; break;
            case 8 : property="FLOTILLA"; break;
            case 9 : property="FLOTILLANOVALIDADA"; break;
            case 10 : property="NOCONTACTAR"; break;
            case 11 : property="OTRAMARCA"; break;
            case 12 : property="PROFECO"; break;
            case 13 : property="SERVICIOINTERNO"; break;
            case 14 : property="SINCONCESIONARIA"; break;
            case 15 : property="SINMODELO"; break;
            case 16 : property="SINNOMBRE"; break;
            case 17 : property="SINTELEFONO"; break;
            case 18 : property="TELSUGPORVW"; break;
            case 19 : property="TELDUPDIFNOMYCHASIS"; break;
            case 20 : property="TELVWBANK"; break;
            case 21 : property="TELVWMEXICO"; break;
            case 22 : property="TELEFONOINCOMPLETO"; break;
        }

        switch (Number($scope.searchs.depuwhere))
        {
            case 1:
                wherex = " == ";
                break;
            case 2:
                wherex = " < ";
                break;
            case 3:
                wherex = " > ";
                break;
        }




        var query = '$.'+property + ' ' + wherex + ' ' + valuex;
        var concecionario = Enumerable.From($scope.bdData)
            .Where(query)
            //.Where(function (x) { return x.DEALERID == $scope.searchs.dealerID })
            .Select(function (x) { return x })
            .ToArray();
        $scope.agencias = [];
        $scope.agencias = concecionario;
        $scope.$apply();
    }

    $scope.FindDFilterDepVentas = function()
    {
        var property = "";
        var wherex = "";
        var valuex = $scope.searchs.depuvalueVentas;
        switch (Number($scope.searchs.depufilterVentas)) {

            case 2 : property="RECIBIDOS"; break;
            case 4 : property="APTOS"; break;
            case 6 : property="AGENCIACANCELADA"; break;
            case 7 : property="AUTODEMO"; break;
            case 8 : property="DUPLICADO"; break;
            case 9 : property="DUPLICADO3MESES"; break;
            case 10 : property="EMPRESASINCONTACTO"; break;
            case 11 : property="ERRORFECHASERVICIO"; break;
            case 12 : property="FLOTILLA"; break;
            case 13 : property="FLOTILLANOVALIDADA"; break;
            case 14 : property="NOCONTACTAR"; break;
            case 15 : property="OTRAMARCA"; break;
            case 16 : property="PROFECO"; break;
            case 17 : property="SERVICIOINTERNO"; break;
            case 18 : property="SINCONCESIONARIA"; break;
            case 19 : property="SINMODELO"; break;
            case 20 : property="SINNOMBRE"; break;
            case 21 : property="SINTIPOCLIENTE"; break;
            case 22 : property="SINTELEFONO"; break;
            case 23 : property="TELSUGPORVW"; break;
            case 24 : property="TELDUPDIFNOMYCHASIS"; break;
            case 25 : property="TELVWBANKLEASING"; break;
            case 26 : property="TELVWMEXICO"; break;
            case 27 : property="TELEFONOINCOMPLETO"; break;
            case 28 : property="VINDUPLICADOBASEANTERIOR"; break;


        }

        switch (Number($scope.searchs.depuwhereVentas))
        {
            case 1:
                wherex = " == ";
                break;
            case 2:
                wherex = " < ";
                break;
            case 3:
                wherex = " > ";
                break;
        }




        var query = '$.'+property + ' ' + wherex + ' ' + valuex;
        var concecionario = Enumerable.From($scope.bdDataVentas)
            .Where(query)
            //.Where(function (x) { return x.DEALERID == $scope.searchs.dealerID })
            .Select(function (x) { return x })
            .ToArray();
        $scope.agenciasVentas = [];
        $scope.agenciasVentas = concecionario;
        $scope.$apply();
    }

    $scope.ClearFilter= function()
    {
        $scope.agencias = [];
        $scope.agencias= $scope.bdData;
        $scope.$apply();
    }

    $scope.ClearFilterVentas= function()
    {
        $scope.agenciasVentas = [];
        $scope.agenciasVentas= $scope.bdDataVentas;
        $scope.$apply();
    }

    $scope.FindDealer = function()
    {
        var concecionario = Enumerable.From($scope.bdData)
            .Where(function (x) { return x.DEALERID == $scope.searchs.dealerID })
            .Select(function (x) { return x })
            .FirstOrDefault();
        $scope.agencias = [];
        $scope.agencias.push(concecionario);
        $scope.$apply();

    }

    $scope.FindDealerVentas = function()
    {
        var concecionario = Enumerable.From($scope.bdDataVentas)
            .Where(function (x) { return x.NUMCONCE == $scope.searchs.dealerIDVentas })
            .Select(function (x) { return x })
            .FirstOrDefault();
        $scope.agenciasVentas = [];
        $scope.agenciasVentas.push(concecionario);
        $scope.$apply();

    }

    $scope.Download = function()
    {
        JSONToCSVConvertor(JSON.stringify($scope.agencias), "Casuistica", true);

        function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "IPSOS_VW_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g,"_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    $scope.DownloadVentas = function()
    {
        JSONToCSVConvertor(JSON.stringify($scope.agenciasVentas), "CasuisticaVentas", true);
        function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "IPSOS_VW_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g,"_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    $scope.DownloadReparaciones = function()
    {
        JSONToCSVConvertor(JSON.stringify($scope.agenciasReparaciones), "ReparacionesServicio", true);
        function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';
            //Set Report title in first row or line

            CSV += ReportTitle + '\r\n\n';

            //This condition will generate the Label/Header
            if (ShowLabel) {
                var row = "";

                //This loop will extract the label from 1st index of on array
                for (var index in arrData[0]) {

                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }

                row = row.slice(0, -1);

                //append Label row with line break
                CSV += row + '\r\n';
            }

            //1st loop is to extract each row
            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                //2nd loop will extract each column and convert it in string comma-seprated
                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                //add a line break after each row
                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            //Generate a file name
            var fileName = "IPSOS_VW_";
            //this will remove the blank-spaces from the title and replace it with an underscore
            fileName += ReportTitle.replace(/ /g,"_");

            //Initialize file format you want csv or xls
            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            // Now the little tricky part.
            // you can use either>> window.open(uri);
            // but this will not work in some browsers
            // or you will not get the correct file extension

            //this trick will generate a temp <a /> tag
            var link = document.createElement("a");
            link.href = uri;

            //set the visibility hidden so it will not effect on your web-layout
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            //this part will append the anchor tag and remove it after automatic click
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    $scope.FillReport = function()
    {

        var ws = new WebSocket($rootScope.wsURL);
        ws.onopen = function()
        {
            var data = { Medicion:'bla'};
            var text = JSON.stringify(data);
            // Web Socket is connected, send data using send()
            $scope.dataLoading = true;
            $scope.$apply();
            ws.send("GETCASUISTICA " + text);
        };
        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            var lista = JSON.parse(received_msg)

            var he = lista[0];
            for (var h in he) {
                if(h == 'REGION')
                {

                }
                else {
                    $scope.csColNames.push(h);
                }
            }

            $scope.bdData = lista;
            $scope.agencias = lista;
            $scope.dataLoading = false;

            $scope.$apply();

        };
        ws.onclose = function()
        {
            // websocket is closed.
            $scope.dataLoading = false;
            $scope.$apply();
            alert("Connection is closed...");
        };
        ws.onerror = function(e, msg)
        {
            $scope.dataLoading = false;
            $scope.$apply();
            alert(e.message);
        }


    }

    $scope.FillReportCasuisticaVentas = function()
    {
        var t = $scope.searchs.medicionVentas;
        var t2 = $scope.searchs.anioVentas;

        var ws = new WebSocket($rootScope.wsURL);
        ws.onopen = function()
        {
            var data = { Medicion:'bla'};
            var text = JSON.stringify(data);
            // Web Socket is connected, send data using send()
            $scope.dataLoading = true;
            $scope.$apply();
            ws.send("GETCASUISTICAVENTAS " + text);
        };
        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            var lista = JSON.parse(received_msg)

            var he = lista[0];
            for (var h in he) {
                if(h == 'REGION' || h == 'NUMCONCE2'|| h == 'NUMCONCE3'|| h == 'NUMCONCE4'|| h == 'NUMCONCE5')
                {

                }
                else {
                    $scope.csColNamesVentas.push(h);
                }
            }

            $scope.bdDataVentas = lista;
            $scope.agenciasVentas = lista;
            $scope.dataLoading = false;
            $scope.$apply();

        };
        ws.onclose = function()
        {
            // websocket is closed.
            $scope.dataLoading = false;
            alert("Connection is closed...");
        };
        ws.onerror = function(e, msg)
        {
            $scope.dataLoading = false;
            alert(e.message);
        }
    }

    $scope.FillReportReparaciones = function()
    {
        var ws = new WebSocket($rootScope.wsURL);
        ws.onopen = function()
        {
            var data = { Medicion:'bla'};
            var text = JSON.stringify(data);
            // Web Socket is connected, send data using send()
            $scope.dataLoading = true;
            $scope.$apply();
            ws.send("GETREPARACIONES " + text);
        };
        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            var lista = JSON.parse(received_msg)

            var he = lista[0];
            for (var h in he) {
                if(h == 'REGION')
                {

                }
                else {
                    $scope.csColNamesReparaciones.push(h);
                }
            }
            $scope.bdDataReparacciones = lista;
            $scope.agenciasReparaciones = lista;
            $scope.dataLoading = false;
            $scope.$apply();
        };
        ws.onclose = function()
        {
            // websocket is closed.
            $scope.dataLoading = false;
            $scope.$apply();
            alert("Connection is closed...");
        };
        ws.onerror = function(e, msg)
        {
            $scope.dataLoading = false;
            $scope.$apply();
            alert(e.message);
        }
    }
});

app.controller('AudioCtrl', function($scope, $rootScope)
{
    $scope.listaAudios = [];
    $scope.csColNames2 = [];

    $scope.dataLoading = false;

    var a = audiojs.createAll();
    $scope.audio = a[0];

    $scope.sta = false; //status de bloque de audio
    $scope.csColNamesAudio = [];

    $scope.name  = [];

    $scope.GetAudios = function()
    {
        var ws = new WebSocket($rootScope.wsURL);
        ws.onopen = function()
        {
            var data = { Medicion:'bla'};
            var text = JSON.stringify(data);
            // Web Socket is connected, send data using send()
            $scope.dataLoading = true;
            $scope.$apply();
            ws.send("GETAUDIO " + text);
        };
        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            var audioData = JSON.parse(received_msg)

            var he = audioData[0];
            for (var h in he) {
                $scope.csColNamesAudio.push(h);
            }
            $scope.dataLoading = false;
            for(var i = 0; i < audioData.length; i++)
            {
                audioData[i].STATUSNEW = false;
            }

            $scope.name = audioData;
            $scope.$apply();

        };
        ws.onclose = function()
        {
            // websocket is closed.
            $scope.dataLoading = false;
            $scope.$apply();
            alert("Connection is closed...");

        };
        ws.onerror = function(e, msg)
        {
            $scope.dataLoading = false;
            $scope.$apply();
            alert(e.message);
        }
    };


    $scope.CargaPista = function (rt , urlg, st) {

        var ws = new WebSocket($rootScope.wsURL);
        ws.onopen = function()
        {
            //var data = { audioname:rt };
            //var text = JSON.stringify(data);
            // Web Socket is connected, send data using send()
            if(st == false) {
                $scope.dataLoading = true;
                $scope.$apply();
                $scope.audio.playPause();
                ws.send("GETMP3 " + rt + " " + urlg);
            }
            else
            {
                $scope.sta = false;
                $scope.sta = false;
                $scope.$apply();
                $scope.bloqueo(rt , $scope.sta);
            }
        };
        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;

            if (st == false) {

                //$scope.sleep(3000);
                //$scope.sleep(3000);
                $scope.sta = true;
                $scope.bloqueo(rt , $scope.sta);
                $scope.audio.load(received_msg);
                $scope.audio.play();
            } else {
                $scope.sta = false;
                // $scope.$apply();
                $scope.bloqueo(rt , $scope.sta);
            }
            $scope.dataLoading = false;
            $scope.$apply();
        };
        ws.onclose = function()
        {
            // websocket is closed.
            $scope.dataLoading = false;
            $scope.$apply();
            alert("Connection is closed...");

        };
        ws.onerror = function(e, msg)
        {
            $scope.dataLoading = false;
            $scope.$apply();
            alert(e.message);

        }


        $scope.bloqueo = function (song, st) {

            var leng = $scope.name.length;

            for (var i = 0; i < leng ; i++) {

                if (st == true) {
                    if (song != $scope.name[i].NAMEAUDIO) {
                        $scope.name[i].STATUSNEW = true
                        $scope.$apply();
                    }
                } else {
                    $scope.name[i].STATUSNEW = false
                    $scope.$apply();

                }

            }
        };

        $scope.sleep = function (millisecond) {

            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > millisecond) {
                    break;
                }
            }
        }


    };

    $scope.descarga = function(){

        alert('entre')

    };

    $scope.LlenarAudios = function()
    {
        var ws = new WebSocket("ws://localhost:9001");
        ws.onopen = function()
        {
            var data = { Medicion:'bla'};
            var text = JSON.stringify(data);
            // Web Socket is connected, send data using send()
            ws.send("GETCASUISTICA " + text);
        };
        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            var lista = JSON.parse(received_msg)
            var he = lista[0];
            for (var h in he) {
                $scope.csColNames2.push(h);
            }
            $scope.listaAudios = lista;
            $scope.$apply();

        };
        ws.onclose = function()
        {
            // websocket is closed.
            alert("Connection is closed...");
        };
        ws.onerror = function(e, msg)
        {
            alert(e.message);
        }
    }
})