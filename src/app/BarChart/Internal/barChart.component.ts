import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { BarChart, BoxplotChart, CandlestickChart, FunnelChart, GaugeChart, GraphChart, HeatmapChart, LineChart, LinesChart, PieChart, RadarChart, SankeyChart, ScatterChart, SunburstChart, ThemeRiverChart, TreeChart, TreemapChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent, AriaComponent, AxisPointerComponent, BrushComponent, CalendarComponent, DataZoomComponent, DataZoomInsideComponent, DataZoomSliderComponent, DatasetComponent, GeoComponent, GridSimpleComponent, LegendPlainComponent, LegendScrollComponent, MarkAreaComponent, MarkLineComponent, MarkPointComponent, ParallelComponent, PolarComponent, RadarComponent, SingleAxisComponent, TimelineComponent, TitleComponent, ToolboxComponent, TransformComponent, VisualMapComponent, VisualMapContinuousComponent } from 'echarts/components';
import { loadModules, loadCss } from 'esri-loader';
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'app-bar-chart',
    templateUrl: 'barChart.component.html',
    styleUrls: ['barChart.component.scss']
})

export class BarChartComponent implements OnInit {
    readonly echartsExtentions: any[];
    echartsOptions: EChartsOption = {};
    echartsInstance: any;
    userArray: any[];
    configUrl = 'https://localhost:7269/weatherforecast';
    data: any;
    features: any[];
    featurelayer: any;
    async getConfig() {
        return this.http.get<any>(this.configUrl);
    }
    async showConfig() {
        await (await this.getConfig())
            .subscribe((data: any) => {
                this.data = data;
                console.log("data");
                console.log(data);
                console.log(this.data.type);
                for (let index = 0; index < this.data.length; index++) {
                    const element = this.data[index];
                    let feature = {
                        geometry: {
                            type: "point",
                            x: element.x,
                            y: element.y
                        },
                        attributes: element
                    }
                    this.features.push(feature)

                }
                console.log("features");
                console.log(this.features);
                this.featurelayer.source = this.features;

            });
    }


    constructor(private http: HttpClient) {
        this.userArray = [];
        this.features = [];
        this.echartsExtentions = [BarChart, TooltipComponent, GridComponent, LegendComponent, AriaComponent, AxisPointerComponent, BrushComponent, CalendarComponent, DataZoomComponent, DataZoomInsideComponent, DataZoomSliderComponent, DatasetComponent, GeoComponent, GridSimpleComponent, LegendPlainComponent, LegendScrollComponent, MarkAreaComponent, MarkLineComponent, MarkPointComponent, ParallelComponent, PolarComponent, RadarComponent, SingleAxisComponent, TimelineComponent, TitleComponent, ToolboxComponent, TransformComponent, VisualMapComponent, VisualMapContinuousComponent]

    }

    async ngOnInit() {
        await this.showConfig().then(() => {
            this.echartsOptions = {
                dataset: {
                    source: [
                        ['score', 'amount', 'product'],
                        [89.3, 58212, 'Matcha Latte'],
                        [57.1, 78254, 'Milk Tea'],
                        [74.4, 41032, 'Cheese Cocoa'],
                        [50.1, 12755, 'Cheese Brownie'],
                        [89.7, 20145, 'Matcha Cocoa'],
                        [68.1, 79146, 'Tea'],
                        [19.6, 91852, 'Orange Juice'],
                        [10.6, 101852, 'Lemon Juice'],
                        [32.7, 20112, 'Walnut Brownie']
                    ]
                },
                xAxis: {},
                yAxis: { type: 'category' },
                series: [
                    {
                        type: 'bar',
                        encode: {
                            // Map "amount" column to x-axis.
                            x: 'amount',
                            // Map "product" row to y-axis.
                            y: 'product'
                        }
                    }
                ]
            };

        });

        loadCss();
        // this will lazy load the ArcGIS API
        // and then use Dojo's loader to require the classes
        loadModules(['esri/views/MapView', 'esri/Map', "esri/config", "esri/core/urlUtils", "esri/layers/ImageryLayer",
            "esri/layers/FeatureLayer",
            "esri/layers/MapImageLayer",
            "esri/widgets/ScaleBar",
            "esri/widgets/LayerList",
            "esri/widgets/Legend",
            "esri/widgets/Expand",
            "esri/widgets/Compass",
            "esri/geometry/Extent", "esri/layers/CSVLayer"])
            .then(([MapView, Map, esriConfig, urlUtils, ImageryLayer, FeatureLayer, MapImageLayer, ScaleBar, LayerList, Legend, Expand, Compass,
                Extent, CSVLayer
            ]) => {
                esriConfig.request.proxyUrl = "https://dev.amcde.com/esriproxy/proxy.ashx";

                urlUtils.addProxyRule({
                    urlPrefix: "dev.amcde.com",
                    proxyUrl: "https://dev.amcde.com/esriproxy/proxy.ashx"
                });

                // then we load a web map from an id
                var map = new Map({
                    basemap: "topo-vector"
                });
                // and we show that map in a container w/ id #viewDiv
                var view = new MapView({
                    map: map,
                    container: 'viewDiv'
                });

                this.featurelayer = new FeatureLayer({
                    // URL to the imagery service
                    source: this.features,
                    geometryType: "point",
                    objectIdField: "licenseId"

                });
                map.add(this.featurelayer)
                console.log("layer");
                console.log(this.featurelayer);
                // const template = {
                //     // autocasts as new PopupTemplate()
                //     title: "مبنى {\"MAIN_BUILDING_DESC\"}",
                //     content: "{\"MAIN_BUILDING_DESC\"}",
                // };


                // const csvLayer = new CSVLayer({
                //     url: "/assets/csvLayers/buildings.csv",
                //     copyright: "USGS Earthquakes",
                //     latitudeField: '\"Y\"',
                //     longitudeField: '\"X\"',
                //     popupTemplate: template,
                //     delimiter: ","

                // });

                // map.add(csvLayer);  // adds the layer to the map
                // console.log(csvLayer);
                // layer.when(() => {
                //     const initialExtent = Extent.fromJSON(layer.sourceJSON.initialExtent);
                //     view.goTo(initialExtent);
                // });

            })
            .catch(err => {
                // handle any errors
            });

    }
    onChartClick(event: any) {
        console.log(event);
        this.echartsInstance = event;
        this.echartsInstance.on('click', function (params: any) {
            console.log("eslam");
            console.log(params);
        });

        console.log("event");
    }

}