const LOCATION = {center: [39.942359220866216,51.84239846195779], zoom: 18};

window.map = null;
    
main();
async function main() {
  await ymaps3.ready;
  const {YMap, YMapDefaultSchemeLayer, YMapControls, YMapDefaultFeaturesLayer, YMapMarker} = ymaps3;
    
  const {YMapZoomControl} = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');
    
  map = new YMap(document.getElementById('map'), {location: LOCATION});
    
  map.addChild((scheme = new YMapDefaultSchemeLayer()));
  map.addChild(new YMapDefaultFeaturesLayer());
    
  map.addChild(new YMapControls({position: 'right'}).addChild(new YMapZoomControl({})));
            
  const el = document.createElement('img');
  el.className = 'my-marker';
  el.src = './img/flag.svg';
  el.onclick = () => map.update({location: {...LOCATION, duration: 400}});
  map.addChild(new YMapMarker({coordinates: LOCATION.center}, el));
  map.setBehaviors(['drag','pinchZoom']);
}