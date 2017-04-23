//
//  InterfaceController.swift
//  tastr_WatchOS Extension
//
//  Created by Hadrien Barbat on 10/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import WatchKit
import WatchConnectivity
import Foundation

class InterfaceController: WKInterfaceController, WCSessionDelegate {

    @IBOutlet var mainTable: WKInterfaceTable!
    private var dataSource = TVShowDataSource()
	  var numPongs: Int = 0

		var session: WCSession?

    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
			
			if WCSession.isSupported() {
				print("Activating watch session")
				self.session = WCSession.default()
				self.session?.delegate = self
				self.session?.activate()
			}
        // Configure interface objects here.
        loadTableData()
    }
    
    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
    }
    
    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
    }
	
	override func table(_ table: WKInterfaceTable, didSelectRowAt rowIndex: Int){
		print(dataSource[rowIndex]._id)
		presentController(withName: "DetailInterfaceController", context: self)
		
		session?.sendMessage(["seen": dataSource[rowIndex]._id], replyHandler: { (dict) in
			print("Received response")
		}, errorHandler: nil)

	}
	
    private func loadTableData() {
        mainTable.setNumberOfRows(self.dataSource.count, withRowType: "TVShowTableRowController")
        for index in 0 ..< self.dataSource.count {
            let row = mainTable.rowController(at: index) as! TVShowTableRowController
            row.fillTVShowList(tvshow: self.dataSource[index])
        }
    }
	
	func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String : Any]) {
		print("did receive application context", applicationContext)
		dataSource = TVShowDataSource(watchList: applicationContext as [String : AnyObject])
		loadTableData()
	}
	
	func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
		// Unused
	}
	
	func session(_ session: WCSession, didReceiveUserInfo userInfo: [String : Any]) {
		print("did receive user info", userInfo)
		// Send the bullshit user info back to the device just to demonstrate it works ;)
		/*session.transferUserInfo(userInfo)
		self.sendPing(session)*/
		
	}
	
	func sendPing(_ session: WCSession) {
		print("Sending ping")
		session.sendMessage(["message": "ping"], replyHandler: { (dict) in
			print("Received pong")
			self.numPongs += 1
			self.sendPing(session)
		}, errorHandler: nil)
	}

}
