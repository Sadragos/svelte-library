Dies ist in Projekt, dass als submodule in Svelte Projekten geladen werden kann.

Dafür muss das repository wie folgt eingebunden werden:

* `git submodule add git@github.com:Sadragos/svelte-library.git src/lib/mylib` ausführen
* `git init` in dem Ordner ausführen
* `git update` in dem Ordner ausführen

Gab es Änderungen auf der remote Seite des modules kann  `git submodule update --remote` ausgeführt werden um es zu aktualisieren.