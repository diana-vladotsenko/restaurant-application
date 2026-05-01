document.addEventListener('DOMContentLoaded', () => {
	const menuPath = 'src/json/menu.json';

	fetch(menuPath)
		.then((res) => {
			if (!res.ok) throw new Error('Network response was not ok');
			return res.json();
		})
		.then((data) => {
				const items = Array.isArray(data.menu) ? data.menu : [];

				// grouping items by type preserving insertion order
				const groups = items.reduce((acc, it) => {
					const t = (it.type || 'other').toLowerCase();
					if (!acc[t]) acc[t] = [];
					acc[t].push(it);
					return acc;
				}, {});

				const sections = Array.from(document.querySelectorAll('section.products'));

				Object.keys(groups).forEach((type) => {
					const groupItems = groups[type];

					let section = sections.find((s) => {
						const h = s.querySelector('.p-ghost');
						if (!h) return false;
						const txt = h.textContent.trim().toLowerCase();
						return txt.includes(type) || type.includes(txt);
					});

					if (!section) {
						section = document.createElement('section');
						section.className = 'products';
						section.setAttribute('aria-label', 'Meals');
						const p = document.createElement('p');
						p.className = 'p-ghost';
						p.textContent = type.charAt(0).toUpperCase() + type.slice(1);
						const div = document.createElement('div');
						div.className = 'divider';
						div.setAttribute('aria-hidden', 'true');
						section.appendChild(p);
						section.appendChild(div);
						document.querySelector('main').appendChild(section);
						sections.push(section);
					}

					groupItems.forEach((item) => {
						const article = document.createElement('article');
						article.className = 'product-card';
						article.setAttribute('aria-label', 'Meal');

						const content = document.createElement('div');
						content.className = 'product-card-content';

						const title = document.createElement('h4');
						title.textContent = item.name || '';
						if (item.badge) {
							const span = document.createElement('span');
							span.className = 'badge';
							span.textContent = item.badge;
							title.appendChild(document.createTextNode(' '));
							title.appendChild(span);
						}

						const desc = document.createElement('p');
						desc.className = 'p-secondary';
						desc.textContent = item.description || '';

						content.appendChild(title);
						content.appendChild(desc);

						const aside = document.createElement('aside');
						aside.setAttribute('aria-label', 'Price');
						const priceP = document.createElement('p');
						priceP.innerHTML = `<strong>${formatPrice(item.price)}</strong>`;
						aside.appendChild(priceP);

						article.appendChild(content);
						article.appendChild(aside);

						section.appendChild(article);
					});
				});
			})

	function formatPrice(val) {
		if (typeof val === 'number') {
			return '€' + (Number.isInteger(val) ? val : val.toFixed(2));
		}
		return '€' + String(val || '');
	}
});
