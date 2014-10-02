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
                $scope.dataLoading = true;
                var concesionarios = Enumerable.From($scope.cBase.Base)
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
                    .ToArray();

                $scope.casuiticaReport=[];
                for(var i = 0; i < concesionarios.length; i++)
                {
                    var registros = Enumerable.From($scope.cBase.Base)
                        .Where(function (x) {
                            return x.No_Concesionario == concesionarios[i].No_Concesionario
                        })
                        .Select(function (x) { return x })
                        .ToArray();

                    var row = {};
                    var funicos = Enumerable.From(registros)
                        .Select(function (x) { return x.FUNICO })
                        .ToArray();

                    var estatusDepuracion = Enumerable.From($scope.cBase.EstatusDepuracion)
                        .Where(function(x){
                            if(funicos.indexOf(x.FUNICO) > -1){
                                return true;
                            }else{
                                return false;
                            }
                        })
                        .Select(function (x) { return x })
                        .ToArray();

                    var estatusMarcacion = Enumerable.From($scope.cBase.EstatusMarcacion)
                        .Where(function(x){
                            if(funicos.indexOf(x.FUNICO) > -1){
                                return true;
                            }else{
                                return false;
                            }
                        })
                        .Select(function (x) { return x })
                        .ToArray();

                    row.ID = concesionarios[i].No_Concesionario;
                    row.Recibidos = registros.length;
                    row.AgenciaCancelada = Enumerable.From(estatusDepuracion).Where(function(x){ return x['STATUS DE DEPURACIÓN'] == 'AGENCIA cancelada' }).ToArray().length;
                    row.FechaServicio = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'FECHA SERVICIO Invalida'}).ToArray().length;
                    row.Duplicado = 0;
                    row.DuplicadoConBaseAnterior = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'Vin duplicado con base 2'}).ToArray().length;
                    row.Empresa_sin_contacto = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'S'}).ToArray().length;
                    row.Error_Fecha_de_Servicio = 0;
                    row.No_Contactar =Enumerable.From(estatusDepuracion).Where(function(x){ return x['STATUS DE DEPURACIÓN'] == 'NO CONTACTAR' }).ToArray().length;
                    row.Otra_Marca = 0;
                    row.Profeco = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'Telefono duplicado contra PROFECO'}).ToArray().length;
                    row.Tipo_Servicio = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'TIPO SERVICIO 8'}).ToArray().length;
                    row.Sin_Tipo_Servicio = 0;
                    row.Sin_Consecionaria = 0;
                    row.Sin_Modelo = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'Sin MODELO'}).ToArray().length;
                    row.Sin_Nombre = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'Sin contacto'}).ToArray().length;
                    row.Sin_Telefono = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'Sin telefono'}).ToArray().length;
                    row.Tel_Dup_dif_Nom_y_chasis = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'Nombre/telefono duplicado'}).ToArray().length;
                    row.Tel_VW_Bank_Leasing = 0;
                    row.Tel_VW_México =  0;
                    row.Teléfono_incompleto = Enumerable.From(estatusDepuracion).Where(function(x){return x['STATUS DE DEPURACIÓN'] == 'Telefono incompleto'}).ToArray().length;

                    row.Status_Efectivo = Enumerable.From(estatusMarcacion).Where(function(x){return x['Estatus'] == '7.Llamar mas tarde (CITA PROGRAMADA)'}).ToArray().length;
                    row.Validados = Enumerable.From(estatusMarcacion).Where(function(x){return x['Estatus'] == 'Entrevista Completa'}).ToArray().length;
                    row.Auto_no_entregado_No_Val = 0;
                    row.Agregar_a_lista_de_no_llamar = 0;
                    row.Barrera_de_Idioma= 0;
                    row.Buzón= 0;
                    row.Comunicación_Difícil_Imposible_Escuchar= 0;
                    row.Difícil_de_Localizar_De_Viaje_Vacaciones= 0;
                    row.Encuestado= 0;
                    row.Entrevista_Cancelada_por_Supervisor= 0;
                    row.Entrevista_Revisada= 0;
                    row.Equivocado= 0;
                    row.FaxModem= 0;
                    row.Finado= 0;
                    row.Fuera_de_servicio= 0;
                    row.Garantía_Ventas_Llamar_mas_tarde= 0;
                    row.NA_Sobrecuota= 0;
                    row.No_contesta= 0;
                    row.No_Contesto_encuesta= 0;
                    row.No_Enlaza_Teléfono= 0;
                    row.No_existe= 0;
                    row.No_le_interesa= 0;
                    row.No_se_encuentra= 0;
                    row.No_terminó_encuesta= 0;
                    row.Numero_no_disponible= 0;
                    row.Numero_restringido= 0;
                    row.Ocupado= 0;
                    row.Rehusa_Continuar_Cortó_Entrevista= 0;
                    row.Sin_Extension= 0;
                    row.Sin_Marcar= 0;
                    row.Termino_en_SC0= 0;
                    row.Termino_en_SC01A= 0;
                    row.Termino_en_SC0A= 0;
                    row.Teléfono_Concesionario= 0;
                    row.Tiempo_de_Entrevista_Agotado= 0;
                    row.Servicio_no_realizado= 0;
                    row.No_coincide_Marca_Concesionaria= 0;











                    $scope.casuiticaReport.push(row);

                }
                $rootScope.csReport = $scope.casuiticaReport;
                $scope.dataLoading = false;
                alert("Generado");
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

    $scope.csColNames = [];
    $scope.agencias = [];

    $scope.Download = function()
    {
        JSONToCSVConvertor(JSON.stringify($rootScope.csReport), "Casuistica", true);

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
        var he = $rootScope.csReport[0];
        for (var h in he) {
            $scope.csColNames.push(h);
        }

        $scope.agencias = $rootScope.csReport;

    }
});
