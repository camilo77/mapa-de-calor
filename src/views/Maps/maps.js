import React, { Component } from 'react';
import request from 'request-promise'
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import GoogleMapReact from 'google-map-react';
import Marker from './marker.js';
import ReactLoading from 'react-loading';
import moment from 'moment';


class Maps extends Component {
  constructor(props) {
    super(props);

    this.onChangeService = this.onChangeService.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.setMarkers = this.setMarkers.bind(this);
    this.setMonths = this.setMonths.bind(this);

    this.state = {
      markers: undefined,
      selectedMarkersMock: 1,
      serviceSelected: "1",
      yearSelected: "2018",
      monthSelected: "0",
      loading: false,
      message: '',
      monthsAvaliables: undefined,
    };
  }

  componentDidMount() {
    this.setMonths()
    this.routeEndPoint()
  }

  setMonths(){
    console.log("months updated")
    const today = new Date()
    const todayYear = today.getFullYear()
    // show 12 months
    // si el año seleccionado no es el año actual
    if ( this.state.yearSelected < todayYear ) {
      console.log("year menor")
      var monthsAvaliables = [ <option value={0}>Todos</option> ]
      // mostrar todos los meses
      for ( var i = 1; i <= 12; i++) {
        monthsAvaliables.push( this.createMonth(i, months[i-1].month) )
      }
      this.setState({monthsAvaliables: monthsAvaliables})
    } // si el año seleccionado es el año actual
    else {
      const yearMonths = today.getMonth()+1
      // si el mes seleccionado es mayor a la cantidad de meses del año seleccionado
      if ( this.state.monthSelected > yearMonths ) {
        this.setState( {monthSelected: '0'} ) // seleccionar todos los meses
      }
      // mostrar todos los meses del año en curso
      var monthsAvaliables = [ <option value={0}>Todos</option> ]
      for ( var i = 1; i <=  yearMonths - 1 ; i++) {
        monthsAvaliables.push( this.createMonth(i, months[i-1].month) )
      }
      this.setState({monthsAvaliables: monthsAvaliables})
    }
  }

  createMonth(index, name){
    return (<option value={index}>{name}</option>)
  }

  setMarkers( posiciones ){
    console.log(posiciones)
    const markers = posiciones.map( element => {
      return (
        <Marker
          lat={element.latitud}
          lng={element.longitud}
          pqrs={`# PQRS: ${element.numero_pqrs}`}
          centroPoblado={`${element.centro_poblado}`}
        />
      )
    })
    this.setState({ markers: markers })
  }

  static defaultProps = {
    center: {
      lat: 4.73,
      lng: -74.07
    },
    zoom: 6
  };

  onChangeService(event) {
    this.setState( {serviceSelected: event.target.value}, this.routeEndPoint )
  }

  onChangeYear(event) {
    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    if( todayMonth < this.state.monthSelected ){
      this.setState( { yearSelected: event.target.value, monthSelected: '0' }, () => {
        this.setMonths()
        this.routeEndPoint()
      })
    } else {
      this.setState( { yearSelected: event.target.value }, () => {
        this.setMonths()
        this.routeEndPoint()
      })
    }

  }

  onChangeMonth(event) {
    this.setState( { monthSelected: event.target.value }, this.routeEndPoint )
  }

  async routeEndPoint() {
    //define the endpint to call
    console.log()
    var uri = undefined
    // si quiere ver todos los servicios
    if ( this.state.serviceSelected == "1" ) {
      console.log("Month", this.state.monthSelected)
      // si quiere ver todos los meses
      if ( this.state.monthSelected == "0" )
        uri = `http://172.16.44.9:5000/pqr/${this.state.yearSelected}`
      else { // si quiere ver un mes especifico
        uri = `http://172.16.44.9:5000/pqr/${this.state.yearSelected}/${this.state.monthSelected}`
      }
    } else {
      console.log("Month", this.state.monthSelected)
      // si quiere ver todos los meses
      if ( this.state.monthSelected == "0" )
        uri = `http://172.16.44.9:5000/pqr/${services[this.state.serviceSelected].service}/${this.state.yearSelected}`
      else
        uri = `http://172.16.44.9:5000/pqr/${services[this.state.serviceSelected].service}/${this.state.yearSelected}/${this.state.monthSelected}`

    }
    console.log("llamando url", uri)
    //setting options
    var options = {
      method: 'GET',
      uri: uri,
      json: true
    }
    // calling endpoint
    try {
      this.setState({ loading: true})
      const response = await request(options);
      console.log("response", response)
      this.setMarkers(response) // set markers
      this.setState({ loading: false, message: 'Datos cargados con éxito'})
    }
    catch (error) {
      console.log(error);
      //this.setMarkers(mockPositions) // delete this line
      console.log("set markers")
      this.setState({ loading: false, message: 'Error al cargar los datos'})
    }
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg="4" xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Filtros Mapa</strong>
                <small> Completar formulario</small>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="service-name">Servicios</Label>
                      <Input type="select" name="service-name" id="service-name" onChange={this.onChangeService}>
                        <option value="1">Todos</option>
                        <option value="2">Energía</option>
                        <option value="3">Gas</option>
                        <option value="4">Glp</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="year">Año</Label>
                      <Input type="select" name="year" id="year" onChange={this.onChangeYear}>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>
                      <Label htmlFor="month">Mes</Label>
                      <Input type="select" name="month" id="month" onChange={this.onChangeMonth}>
                        {this.state.monthsAvaliables}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col align='center'>
                    { this.state.loading ? <ReactLoading type={"bars"} color={"#009688"} height={'10%'}/> : <Label>{this.state.message}</Label> }
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="8" xs="12" sm="12">
            <div style={{ height: '70vh', width: '100%' }}>
              <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCQsME62_dl7clydkmw4DS0KZbcRCWzNRg" }}
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
              >
                {this.state.markers}
              </GoogleMapReact>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const services = {
  "2": {
    service: "energia"
  },
  "3": {
    service: "gas"
  },
  "4": {
    service: "glp"
  }
}

const months = [
  { key: 1, month: 'Enero' },
  { key: 2, month: 'Febrero' },
  { key: 3, month: 'Marzo' },
  { key: 4, month: 'Abril' },
  { key: 5, month: 'Mayo' },
  { key: 6, month: 'Junio' },
  { key: 7, month: 'Julio' },
  { key: 8, month: 'Agosto' },
  { key: 9, month: 'Septiembre' },
  { key: 10, month: 'Octubre' },
  { key: 11, month: 'Noviembre' },
  { key: 12, month: 'Diciembre' }
]
const mockPositions = [
    {
        "centro_poblado": "RAMIRIQUI",
        "numero_pqrs": 6,
        latitud: 5.40022164431,
        longitud: -73.33486896309999
    },
    {
        "centro_poblado": "SAN JOSE",
        "numero_pqrs": 1,
        latitud: 5.08156947455,
        longitud: -75.79200443750001
    },
    {
        "centro_poblado": "GUACHENE",
        "numero_pqrs": 1,
        latitud: 3.13415329544,
        longitud: -76.3921887379
    },
    {
        "centro_poblado": "INZA",
        "numero_pqrs": 1,
        latitud: 2.5491829843100002,
        longitud: -76.0635027215
    },
    {
        "centro_poblado": "VILLA RICA",
        "numero_pqrs": 4,
        latitud: 3.17757792648,
        longitud: -76.457872658
    },
    {
        "centro_poblado": "CAQUEZA",
        "numero_pqrs": 5,
        latitud: 4.40410105992,
        longitud: -73.946474203
    },
    {
        "centro_poblado": "CHIPAQUE",
        "numero_pqrs": 2,
        latitud: 4.44267101655,
        longitud: -74.04487563090001
    }
]

const mockPositions2 = [
    {
        "centro_poblado": "MEDELLIN",
        "numero_pqrs": 2685,
        latitud: 6.24960557194,
        longitud: -75.57736775660001
    },
    {
        "centro_poblado": "MONTEBELLO",
        "numero_pqrs": 1,
        latitud: 5.94632556697,
        longitud: -75.5235109116
    },
    {
        "centro_poblado": "YARUMALITO",
        "numero_pqrs": 1,
        latitud: 5.95015928602,
        longitud: -75.57743194480001
    },
    {
        "centro_poblado": "YOLOMBO",
        "numero_pqrs": 5,
        latitud: 6.59459243359,
        longitud: -75.0133505772
    },
    {
        "centro_poblado": "CARTAGENA DE INDIAS, DISTRITO TURISTICO, HISTORICO Y CULTURAL",
        "numero_pqrs": 229,
        latitud: 10.384985522600001,
        longitud: -75.49643102799999
    },
    {
        "centro_poblado": "PAZ DE RIO",
        "numero_pqrs": 6,
        latitud: 5.987644905790001,
        longitud: -72.74913738309999
    },
    {
        "centro_poblado": "PUERTO BOYACA",
        "numero_pqrs": 4,
        latitud: 5.97793495174,
        longitud: -74.5879991859
    }
]

export default Maps;
