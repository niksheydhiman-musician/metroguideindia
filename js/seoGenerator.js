/**
 * seoGenerator.js
 * Generates SEO-optimized meta tags and content for route pages.
 */

const SEOGenerator = (() => {

  function slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function routeSlug(fromName, toName) {
    return `${slugify(fromName)}-to-${slugify(toName)}`;
  }

  function setMetaTags({ title, description, url }) {
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', url || window.location.href, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
  }

  function setMeta(name, content, isProperty = false) {
    const attr = isProperty ? 'property' : 'name';
    let tag = document.querySelector(`meta[${attr}="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  }

  function generateRouteTitle(fromName, toName) {
    return `${fromName} to ${toName} RRTS & Metro Route, Distance, Fare | MetroGuideIndia`;
  }

  function generateRouteDescription(fromName, toName, distance, fare, time) {
    return `Find the ${fromName} to ${toName} metro/RRTS route. Total distance: ${distance} km, estimated fare: ₹${fare}, travel time: ~${time} mins. Complete station list and interchange guide.`;
  }

  function generateRouteContent(fromName, toName, path, stations, distance, fare, time) {
    const stationNames = path.map(p => {
      const s = stations.find(st => st.station_id === p.station_id);
      return s ? s.station_name : p.station_id;
    });

    return `
      <p class="seo-intro">
        Planning your journey from <strong>${fromName}</strong> to <strong>${toName}</strong>?
        This route covers <strong>${distance} km</strong> and takes approximately
        <strong>${time} minutes</strong> with an estimated fare of <strong>₹${fare}</strong>.
      </p>
      <p class="seo-body">
        The route passes through ${stationNames.length} stations on the Delhi–Meerut RRTS and/or Meerut Metro network,
        operated by NCRTC. The Namo Bharat RRTS connects Delhi to Meerut at high speed,
        while the Meerut Metro provides urban connectivity within Meerut city.
      </p>
    `;
  }

  return { slugify, routeSlug, setMetaTags, generateRouteTitle, generateRouteDescription, generateRouteContent };
})();
