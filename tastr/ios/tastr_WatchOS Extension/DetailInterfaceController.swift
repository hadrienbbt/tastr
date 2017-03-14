//
//  DetailInterfaceController.swift
//  tastr
//
//  Created by Hadrien Barbat on 11/03/2017.
//  Copyright © 2017. All rights reserved.
//

import WatchKit
import Foundation

class DetailInterfaceController: WKInterfaceController {
	
	@IBOutlet var titre: WKInterfaceLabel!
	@IBOutlet var good: WKInterfaceButton!
	@IBOutlet var fun: WKInterfaceButton!
	@IBOutlet var wow: WKInterfaceButton!
	@IBOutlet var sad: WKInterfaceButton!
	@IBOutlet var soso: WKInterfaceButton!
	@IBOutlet var bad: WKInterfaceButton!
	private var tvshowRef: TVShow? // reference
	
	override func awake(withContext context: Any?) {
		super.awake(withContext: context)
		
		// Configure interface objects here.
		if let tvshow = context as? TVShow {
			self.tvshowRef = tvshow
			
			// Une fois le contexte défini, on peut configurer les InterfaceObject de notre vue
			self.titre.setText(tvshow.title)
			print("coucou")
		} else {
			print("pas coucou")
		}
	}
}
