export function generateBookmarkletCode(trackerUrl: string): string {
  // This JS runs on the PoE challenges page in the user's browser
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
  var allAchievements = document.querySelectorAll('.achievement.clearfix, .achievement.clearfix.incomplete');

  document.querySelectorAll('.achievement.clearfix').forEach(function(el, index) {
    var isIncomplete = el.classList.contains('incomplete');
    var nameEl = el.querySelector('h2:first-of-type');
    var detailEl = el.querySelector('.completion-detail');
    var detailSpan = detailEl ? detailEl.querySelector('span') : null;
    var completed = detailSpan ? parseInt(detailSpan.textContent.trim()) || 0 : 0;
    var requiredText = detailEl ? detailEl.textContent : '';
    var slashParts = requiredText.split('/');
    var required = slashParts.length > 1 ? parseInt(slashParts[1].trim()) || 0 : 0;

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

  var progress = {
    leagueId: leagueId,
    accountName: accountName,
    challenges: challenges,
    lastSynced: new Date().toISOString()
  };

  var encoded = encodeURIComponent(JSON.stringify(progress));
  window.open('${trackerUrl}#import=' + encoded, '_blank');
})()`.trim();

  return `javascript:${encodeURIComponent(code)}`;
}

export function getBookmarkletDisplayCode(): string {
  return "Drag this link to your bookmarks bar, then click it on your PoE challenges page.";
}
