import React, { Component } from 'react';
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
import Marker from './marker.js'


class Maps extends Component {
  constructor(props) {
    super(props);

    this.onChangeService = this.onChangeService.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);

    this.state = {
      markers: undefined,
      selectedMarkersMock: 1,
      serviceSelected: "1",
      yearSelected: "2018"
    };
  }

  componentDidMount() {
    this.setMarkers(mockPositions)
  }

  setMarkers( posiciones ){
    const markers = posiciones.map( element => {
      return (
        <Marker
          lat={element.latitud}
          lng={element.longitud}
          pqrs={`# PQRS: ${element.pqrs}`}
          centroPoblado={`${element.centroPoblado}`}
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
    if ( this.state.selectedMarkers == 1) {
      this.setMarkers(mockPositions)
      this.setState({selectedMarkers: 2})
    } else {
      this.setMarkers(mockPositions2)
      this.setState({selectedMarkers: 1})
    }
  }

  onChangeYear(event) {
    this.setState( { yearSelected: event.target.value }, this.routeEndPoint )
  }

  routeEndPoint() {
    if ( this.state.serviceSelected == "1" ) {
      alert(`call endpoint -- /pqr/${this.state.yearSelected}`)
    } else {
      alert(`call endpoint -- /pqr/${services[this.state.serviceSelected].service}/${this.state.yearSelected}`)
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
                  <Col xs="6">
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
                  <Col xs="6">
                    <FormGroup>
                      <Label htmlFor="year">Año</Label>
                      <Input type="select" name="year" id="year" onChange={this.onChangeYear}>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                      </Input>
                    </FormGroup>
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
const mockPositions = [
    {
        centroPoblado: "RAMIRIQUI",
        pqrs: 6,
        latitud: 5.40022164431,
        longitud: -73.33486896309999
    },
    {
        centroPoblado: "SAN JOSE",
        pqrs: 1,
        latitud: 5.08156947455,
        longitud: -75.79200443750001
    },
    {
        centroPoblado: "GUACHENE",
        pqrs: 1,
        latitud: 3.13415329544,
        longitud: -76.3921887379
    },
    {
        centroPoblado: "INZA",
        pqrs: 1,
        latitud: 2.5491829843100002,
        longitud: -76.0635027215
    },
    {
        centroPoblado: "VILLA RICA",
        pqrs: 4,
        latitud: 3.17757792648,
        longitud: -76.457872658
    },
    {
        centroPoblado: "CAQUEZA",
        pqrs: 5,
        latitud: 4.40410105992,
        longitud: -73.946474203
    },
    {
        centroPoblado: "CHIPAQUE",
        pqrs: 2,
        latitud: 4.44267101655,
        longitud: -74.04487563090001
    }
]

const mockPositions2 = [
    {
        centroPoblado: "MEDELLIN",
        pqrs: 2685,
        latitud: 6.24960557194,
        longitud: -75.57736775660001
    },
    {
        centroPoblado: "MONTEBELLO",
        pqrs: 1,
        latitud: 5.94632556697,
        longitud: -75.5235109116
    },
    {
        centroPoblado: "YARUMALITO",
        pqrs: 1,
        latitud: 5.95015928602,
        longitud: -75.57743194480001
    },
    {
        centroPoblado: "YOLOMBO",
        pqrs: 5,
        latitud: 6.59459243359,
        longitud: -75.0133505772
    },
    {
        centroPoblado: "CARTAGENA DE INDIAS, DISTRITO TURISTICO, HISTORICO Y CULTURAL",
        pqrs: 229,
        latitud: 10.384985522600001,
        longitud: -75.49643102799999
    },
    {
        centroPoblado: "PAZ DE RIO",
        pqrs: 6,
        latitud: 5.987644905790001,
        longitud: -72.74913738309999
    },
    {
        centroPoblado: "PUERTO BOYACA",
        pqrs: 4,
        latitud: 5.97793495174,
        longitud: -74.5879991859
    }
]

export default Maps;
