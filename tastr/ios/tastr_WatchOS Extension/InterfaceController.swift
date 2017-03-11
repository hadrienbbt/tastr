//
//  InterfaceController.swift
//  tastr_WatchOS Extension
//
//  Created by Hadrien Barbat on 10/03/2017.
//  Copyright © 2017 Facebook. All rights reserved.
//

import WatchKit
import Foundation


class InterfaceController: WKInterfaceController {

    @IBOutlet var mainTable: WKInterfaceTable!
    private var dataSource = TVShowDataSource()

    override func awake(withContext context: Any?) {
        super.awake(withContext: context)
        
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
  
    private func loadTableData() {
        mainTable.setNumberOfRows(self.dataSource.count, withRowType: "TVShowTableRowController")
        for index in 0 ..< self.dataSource.count {
            let row = mainTable.rowController(at: index) as! TVShowTableRowController
            row.fillTVShowList(tvshow: self.dataSource[index])
        }
    }

}
