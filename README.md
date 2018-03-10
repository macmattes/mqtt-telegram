# mqtt-telegram
senden und empfangen von Nachrichten
Ersatz für Telegram in Fhem, da dies ständig macken hatte
schnappschüsse aus ipcams (xmeye) hinzugefügt, wenn im topic /image vorkommt und der Payload aus URl des Bildes 
und hinter raute angefügtem Name einer tmp Datei besteht.
bsp telegram/send/image/"-grouchatid" http://adrressedercam/webcapture.jpg?command=snap&channel=0#dateiname.jpg
im standard wir nur der Payload als text verschickt
fhem lauscht auf telegram/recv/"-grouchatid" , dort dannn weiter mit notify
