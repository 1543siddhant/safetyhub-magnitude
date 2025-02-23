let map, marker, policeMarker, hospitalMarker, service;
let nearestPoliceLocation;
let nearestHospitalLocation;
let peopleMarkers = []; // Store markers for nearby people

// Dark mode styles for the Google Map (from SnazzyMaps)
const darkModeStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }]
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }]
  }
];

function initMap(lat, lng) {
  if (!map) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 15,
      styles: darkModeStyle
    });

    marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: "You are here",
      label: "You"
    });

    service = new google.maps.places.PlacesService(map);
  } else {
    marker.setPosition({ lat, lng });
    map.setCenter({ lat, lng });
  }

  findNearestPolice(lat, lng);
  findNearestHospital(lat, lng);
  placeNearbyPeople(lat, lng);

  document.getElementById("map-container").scrollIntoView({ behavior: "smooth" });
}

function findNearestPolice(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);
  service.nearbySearch(
    {
      location,
      radius: 1500,
      keyword: "police"
    },
    (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results.length > 0
      ) {
        const nearest = results[0];
        document.getElementById("police").textContent = `${nearest.name}, ${nearest.vicinity}`;
        nearestPoliceLocation = nearest.geometry.location;

        policeMarker = new google.maps.Marker({
          position: nearest.geometry.location,
          map: map,
          title: "Nearest Police Station",
          label: "Police Station"
          // icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        document.getElementById("info").classList.remove("hidden");
        document.getElementById("navigate-btn").classList.remove("hidden");
      } else {
        document.getElementById("police").textContent = "Nearest Police Station: Not Found.";
        nearestPoliceLocation = null;
      }
    }
  );
}

function findNearestHospital(lat, lng) {
  const location = new google.maps.LatLng(lat, lng);
  service.nearbySearch(
    {
      location,
      radius: 1500,
      keyword: "hospital"
    },
    (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results.length > 0
      ) {
        const nearest = results[0];
        document.getElementById("hospital").textContent = `${nearest.name}, ${nearest.vicinity}`;
        nearestHospitalLocation = nearest.geometry.location;

        hospitalMarker = new google.maps.Marker({
          position: nearest.geometry.location,
          map: map,
          title: "Nearest Hospital/Clinic",
          label: "Hospital"
          // icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
        });
        document.getElementById("info").classList.remove("hidden");
        document.getElementById("navigate-btn2").classList.remove("hidden");
      } else {
        document.getElementById("hospital").textContent = "Nearest Hospital/Clinic: Not Found.";
        nearestHospitalLocation = null;
      }
    }
  );
}

function placeNearbyPeople(lat, lng) {
  const colors = ["yellow", "green", "purple", "orange", "pink"];
  peopleMarkers.forEach((marker) => marker.setMap(null));
  peopleMarkers = [];

  for (let i = 0; i < 5; i++) {
    const randLat = lat + (Math.random() - 0.5) * 0.01;
    const randLng = lng + (Math.random() - 0.5) * 0.01;
    const personMarker = new google.maps.Marker({
      position: { lat: randLat, lng: randLng },
      map: map,
      title: `Person ${i + 1}`,
      label: `Person${i + 1}`,
      icon: `http://maps.google.com/mapfiles/ms/icons/${colors[i]}-dot.png`
    });
    peopleMarkers.push(personMarker);
  }
}

function startTracking() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        initMap(latitude, longitude);
      },
      () => {
        alert("Failed to access location.");
      }
    );
  } else {
    alert("Geolocation not supported.");
  }
}

function navigate() {
  if (nearestPoliceLocation) {
    const lat = nearestPoliceLocation.lat();
    const lng = nearestPoliceLocation.lng();
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  } else {
    alert("No police station found to navigate.");
  }
}

function navigateToHospital() {
  if (nearestHospitalLocation) {
    const lat = nearestHospitalLocation.lat();
    const lng = nearestHospitalLocation.lng();
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank");
  } else {
    alert("No hospital found to navigate.");
  }
}

function toggleMenu() {
  document.getElementById("navbar").classList.toggle("show");
}

const hamburger = document.querySelector(".hamburger");
hamburger.classList.toggle("active");
