export function generateBookmarkletCode(trackerUrl: string): string {
  // This JS runs on the PoE challenges page in the user's browser
  // It scrapes challenge data from the DOM and POSTs it to our API
  const code = `
(function(){
  var els = document.querySelectorAll('.achievement.clearfix');
  if (!els.length) { alert('No challenges found. Open your PoE challenges page first.'); return; }

  var seasonSel = document.querySelector('select[name="season"]');
  var leagueId = seasonSel ? seasonSel.value.toLowerCase() : 'unknown';

  var profileLink = document.querySelector('.profile-link');
  var accountName = '';
  if (profileLink) {
    var m = profileLink.className.match(/\\b(\\S+)\\s+completed/);
    accountName = m ? m[1] : '';
  }

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

  var url = '${trackerUrl}/api/import';
  var body = JSON.stringify({ leagueId: leagueId, accountName: accountName, challenges: challenges });

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.ok) {
      alert('Imported ' + data.imported + ' challenges to ' + data.user + '!');
    } else {
      alert('Import failed: ' + (data.error || 'Unknown error') + '\\n\\nMake sure you are signed in at ${trackerUrl}');
    }
  })
  .catch(function(err) {
    alert('Could not reach tracker. Is it running?\\n\\n' + err.message);
  });
})()`.trim();

  return `javascript:${encodeURIComponent(code)}`;
}
