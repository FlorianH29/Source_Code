from server.bo import BusinessObject as bo
from abc import ABC


class Transaction (bo.BusinessObject, ABC):

    def __init__(self):
        super().__init__()
        self._affiliated_work_time_acount = None  # id des zugehörigen Arbeitszeitaccounts
        """hier wird auf den zugehörigen WorkTimeAccount verwiesen"""

    def set_affiliated_work_time_account(self, affiliated_work_time_account):
        self._affiliated_work_time_acount = affiliated_work_time_account

    def get_affiliated_work_time_account(self):
        return self._affiliated_work_time_acount
