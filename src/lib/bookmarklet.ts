export function generateBookmarkletCode(trackerUrl: string): string {
	// Scrapes challenge data from PoE page, tries direct POST,
	// falls back to opening the tracker with data in URL hash
	const code = `
(function(){
  var els = document.querySelectorAll('.achievement.clearfix');
  if (!els.length) { alert('No challenges found. Open your PoE challenges page first.'); return; }

  var seasonSel = document.querySelector('select[name="season"]');
  var leagueId = seasonSel ? seasonSel.value.toLowerCase() : 'unknown';

  // Extract account name from URL: /account/view-profile/{name}/challenges
  var urlMatch = window.location.pathname.match(/\\/view-profile\\/([^\\/]+)/);
  var accountName = urlMatch ? decodeURIComponent(urlMatch[1]) : '';

  var challenges = [];
  document.querySelectorAll('.achievement.clearfix').forEach(function(el, index) {
    var isIncomplete = el.classList.contains('incomplete');
    var detailEl = el.querySelector('.completion-detail');
    var detailSpan = detailEl ? detailEl.querySelector('span') : null;
    var completed = detailSpan ? parseInt(detailSpan.textContent.trim()) || 0 : 0;

    var subtasks = [];
    el.querySelectorAll('.items li').forEach(function(li, si) {
      var isFinished = li.classList.contains('finished');
      var text = li.textContent.trim();
      var counterMatch = text.match(/\\((\\d[\\d,]*)\\/(\\d[\\d,]*)\\)\\s*$/);
      subtasks.push({
        id: (index + 1) + '-' + (si + 1),
        completed: isFinished,
        counter: counterMatch ? parseInt(counterMatch[1].replace(/,/g,'')) : undefined
      });
    });

    challenges.push({
      challengeId: index + 1,
      completed: completed,
      isComplete: !isIncomplete,
      subtasks: subtasks
    });
  });

  var progress = { leagueId: leagueId, accountName: accountName, challenges: challenges };

  // Try direct POST first (works for browser extension / same-site)
  fetch('${trackerUrl}/api/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(progress)
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.ok) {
      alert('Synced ' + data.imported + ' challenges!');
    } else {
      // Auth failed (cross-origin cookies blocked) — open tracker with data
      var encoded = encodeURIComponent(JSON.stringify(progress));
      window.open('${trackerUrl}#import=' + encoded, '_blank');
    }
  })
  .catch(function() {
    // Network error — fall back to URL
    var encoded = encodeURIComponent(JSON.stringify(progress));
    window.open('${trackerUrl}#import=' + encoded, '_blank');
  });
})()`.trim();

	return `javascript:${encodeURIComponent(code)}`;
}
