// Sprechertext + Timing. Wird vom Video (Browser) und von den Node-Skripten genutzt.
// Aus der Wortanzahl jeder Zeile wird berechnet, wie lange sie dauert –
// alle Animationen im Video hängen an diesen Zeitpunkten.

(function (root) {
  const WORDS_PER_SECOND = 2.5; // normales Vorlesetempo
  const GAP = 0.7;              // Pause zwischen zwei Sätzen
  const LEAD = 1.0;             // Vorlauf am Szenenanfang
  const TAIL = 1.4;             // Nachlauf am Szenenende

  const SCENES = [
    { id: 'intro', title: 'Intro', lead: 1.6, lines: [
      ['A', 'Hallo! In diesem Video erklären wir euch das Sinnesorgan Auge.'],
      ['B', 'Über die Hälfte aller Sinnesrezeptoren unseres Körpers sitzt in den Augen. Sehen ist also unser wichtigster Sinn.'],
      ['A', 'Zuerst schauen wir uns den Aufbau von Auge und Netzhaut an. Danach klären wir, wie aus Licht ein elektrisches Signal wird.'],
    ]},
    { id: 'eye', title: 'Aufbau des Auges', lines: [
      ['B', 'Hier seht ihr das Auge im Querschnitt. Das Licht kommt von links. Ganz vorne liegt die durchsichtige Hornhaut.'],
      ['A', 'Dahinter liegen die Iris mit der Pupille, also der Öffnung in der Mitte, und die Linse.'],
      ['B', 'Den Innenraum füllt der Glaskörper.'],
      ['A', 'Die innerste Schicht ist die Netzhaut, auch Retina genannt. Sie kleidet etwa 75 Prozent des Augapfels aus.'],
      ['B', 'Darunter liegt die Aderhaut mit ihren Blutgefäßen. Über den Sehnerv verlassen die Signale das Auge Richtung Gehirn.'],
    ]},
    { id: 'path', title: 'Strahlengang', lines: [
      ['A', 'Verfolgen wir jetzt den Weg des Lichts – den Strahlengang.'],
      ['B', 'Das Licht fällt zuerst durch die Hornhaut und dann durch die Pupille.'],
      ['A', 'Die Linse bricht das Licht, sodass es gebündelt durch den Glaskörper läuft.'],
      ['B', 'Schließlich trifft es auf die Netzhaut. Erst hier, in den Fotorezeptoren, wird der Lichtreiz in ein elektrisches Signal umgewandelt.'],
    ]},
    { id: 'spots', title: 'Gelber und blinder Fleck', lines: [
      ['A', 'Auf der Netzhaut gibt es zwei besondere Stellen.'],
      ['B', 'Den gelben Fleck, auch Fovea genannt. Hier ist die Dichte der Zapfen besonders hoch – das ist der Bereich des schärfsten Sehens.'],
      ['A', 'Und den blinden Fleck. Hier verlässt der Sehnerv das Auge. Dort gibt es keine Lichtsinneszellen, also sehen wir an dieser Stelle nichts.'],
      ['B', 'Trotzdem bemerken wir keine Lücke, weil das Gehirn die fehlenden Bereiche mit den Informationen des anderen Auges ergänzt.'],
    ]},
    { id: 'retina', title: 'Aufbau der Netzhaut', lines: [
      ['A', 'Jetzt zoomen wir in die Netzhaut hinein. Sie besteht aus mehreren Zellschichten.'],
      ['B', 'Diese Schichten sind invers angeordnet, also scheinbar verkehrt herum.'],
      ['A', 'Das Licht kommt vom Glaskörper und muss erst durch die Ganglienzellen und die Bipolarzellen hindurch. Erst dann erreicht es die Fotorezeptoren, also die Stäbchen und Zapfen.'],
      ['B', 'Dahinter liegen die Pigmentzellen und die Aderhaut.'],
      ['A', 'Das Signal läuft genau in die andere Richtung: vom Fotorezeptor über die Bipolarzelle zur Ganglienzelle. Die Fortsätze der Ganglienzellen bilden zusammen den Sehnerv.'],
      ['B', 'Dazu kommen Horizontalzellen und amakrine Zellen. Sie sind seitlich verschaltet, sodass die Signale schon in der Netzhaut miteinander verrechnet werden.'],
    ]},
    { id: 'receptors', title: 'Aufbau der Fotorezeptoren', lines: [
      ['B', 'Schauen wir uns die Fotorezeptoren genauer an. Davon besitzt der Mensch etwa 125 Millionen – es gibt Stäbchen und Zapfen.'],
      ['A', 'Beide bestehen aus einem Außensegment und einem Innensegment, die durch eine kurze Zilie verbunden sind.'],
      ['B', 'Das Innensegment enthält den Zellkern und die Zellorganellen. Über die synaptische Endigung werden die nachgeschalteten Zellen aktiviert.'],
      ['A', 'Im Außensegment liegt ein Stapel aus Membranscheibchen, den Disks. In ihnen sitzen die Fotopigmente, die das Licht absorbieren.'],
    ]},
    { id: 'compare', title: 'Stäbchen und Zapfen im Vergleich', lines: [
      ['B', 'Vergleichen wir die beiden. Gemeinsam haben sie den Grundaufbau: Außensegment, Zilie, Innensegment und Disks mit Fotopigment.'],
      ['A', 'Ein Unterschied ist die Anzahl: Pro Netzhaut gibt es etwa 120 Millionen Stäbchen, aber nur etwa 6 Millionen Zapfen.'],
      ['B', 'Stäbchen haben ein langes, zylindrisches Außensegment mit sehr vielen Disks. Daraus kann man schließen: Sie sind besonders lichtempfindlich – ideal für das Sehen in der Dämmerung, allerdings nur in Grautönen.'],
      ['A', 'Zapfen haben ein kürzeres, kegelförmiges Außensegment. Sie brauchen mehr Licht, ermöglichen dafür aber Farbsehen und scharfes Sehen – deshalb sitzen sie so dicht im gelben Fleck.'],
    ]},
    { id: 'st', title: 'Signaltransduktion', lines: [
      ['A', 'Jetzt zur Signaltransduktion: Wie wird aus Licht ein elektrisches Signal? Wir erklären das am Beispiel eines Stäbchens.'],
      ['B', 'Die wichtigsten Beteiligten sind das Sehpigment Rhodopsin, das Protein Transducin, ein Enzym und der sekundäre Botenstoff cGMP.'],
    ]},
    { id: 'dark', title: 'Dunkelheit', lines: [
      ['A', 'Beginnen wir in der Dunkelheit. Hier ist das Rhodopsin inaktiv.'],
      ['B', 'Im Außensegment liegt viel cGMP vor. Dieser sekundäre Botenstoff hält die Natrium-Ionenkanäle in der Membran offen.'],
      ['A', 'Natrium-Ionen strömen also ständig in die Zelle ein. Die Membran ist depolarisiert: Das Membranpotential liegt bei etwa minus 30 Millivolt.'],
      ['B', 'Deshalb schüttet das Stäbchen an der Synapse ständig den Transmitter Glutamat aus.'],
      ['A', 'Das Glutamat hemmt die nachgeschaltete Bipolarzelle. Im Dunkeln wird sie also dauerhaft gehemmt.'],
    ]},
    { id: 'light', title: 'Helligkeit', lines: [
      ['B', 'Jetzt fällt Licht auf das Stäbchen. Das Rhodopsin absorbiert ein Photon und wird aktiviert.'],
      ['A', 'Das aktivierte Rhodopsin reagiert mit Transducin und aktiviert es.'],
      ['B', 'Transducin aktiviert wiederum ein Enzym, das den sekundären Botenstoff cGMP spaltet.'],
      ['A', 'Ohne cGMP schließen sich die Natrium-Kanäle. Es strömt kein Natrium mehr in die Zelle.'],
      ['B', 'Die Membran wird hyperpolarisiert. Das Potential sinkt auf etwa minus 70 Millivolt.'],
      ['A', 'Dadurch wird an der Synapse kein Glutamat mehr ausgeschüttet – und die Hemmung der Bipolarzelle fällt weg.'],
      ['B', 'Diese Veränderung wird über die Bipolarzelle und die Ganglienzelle als Signal an den Sehnerv weitergegeben.'],
    ]},
    { id: 'summary', title: 'Zusammenfassung', lines: [
      ['A', 'Fassen wir die Kaskade bei Licht noch einmal zusammen.'],
      ['B', 'Licht aktiviert Rhodopsin. Rhodopsin aktiviert Transducin. Transducin aktiviert das Enzym, und das Enzym baut cGMP ab.'],
      ['A', 'Die Natrium-Kanäle schließen sich, die Zelle hyperpolarisiert, es wird kein Glutamat mehr ausgeschüttet – und die Hemmung der Bipolarzelle fällt weg.'],
      ['B', 'Übrigens: Ein einziges aktiviertes Rhodopsin aktiviert viele Transducin-Moleküle. So wird schon ein schwaches Lichtsignal stark verstärkt.'],
    ]},
    { id: 'outro', title: 'Outro', tail: 3.0, lines: [
      ['A', 'Das war unser Erklärvideo zum Sinnesorgan Auge.'],
      ['B', 'Danke fürs Zuschauen!'],
    ]},
  ];

  function lineDuration(text) {
    const words = text.split(/\s+/).filter(w => /\w/.test(w)).length;
    return Math.max(1.8, words / WORDS_PER_SECOND);
  }

  function computeTiming() {
    let t = 0;
    const scenes = SCENES.map(sc => {
      const start = t;
      let cur = start + (sc.lead ?? LEAD);
      const lines = sc.lines.map(([speaker, text], i) => {
        if (i > 0) cur += GAP;
        const l = { speaker, text, start: cur, end: cur + lineDuration(text) };
        cur = l.end;
        return l;
      });
      const end = cur + (sc.tail ?? TAIL);
      t = end;
      return { id: sc.id, title: sc.title, start, end, lines };
    });
    return { scenes, total: t };
  }

  const api = { SCENES, computeTiming };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.VIDEO_SCRIPT = api;
})(this);
