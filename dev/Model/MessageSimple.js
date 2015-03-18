
(function () {

	'use strict';

	var
		_ = require('_'),

		Utils = require('Common/Utils'),

		MessageHelper = require('Helper/Message'),

		AbstractModel = require('Knoin/AbstractModel')
	;

	/**
	 * @param {string=} sSuperName
	 * @constructor
	 */
	function MessageSimpleModel(sSuperName)
	{
		AbstractModel.call(this, sSuperName || 'MessageSimpleModel');
	}

	_.extend(MessageSimpleModel.prototype, AbstractModel.prototype);

	MessageSimpleModel.prototype.folder = '';
	MessageSimpleModel.prototype.uid = '';
	MessageSimpleModel.prototype.subject = '';

	MessageSimpleModel.prototype.to = [];
	MessageSimpleModel.prototype.from = [];
	MessageSimpleModel.prototype.cc = [];
	MessageSimpleModel.prototype.bcc = [];
	MessageSimpleModel.prototype.replyTo = [];
	MessageSimpleModel.prototype.deliveredTo = [];

	MessageSimpleModel.prototype.fromAsString = '';
	MessageSimpleModel.prototype.fromAsStringClear = '';
	MessageSimpleModel.prototype.toAsString = '';
	MessageSimpleModel.prototype.toAsStringClear = '';
	MessageSimpleModel.prototype.senderAsString = '';
	MessageSimpleModel.prototype.senderAsStringClear = '';

	MessageSimpleModel.prototype.size = 0;
	MessageSimpleModel.prototype.timestamp = 0;

	MessageSimpleModel.prototype.clear = function ()
	{
		this.folder = '';
		this.uid = '';

		this.subject = '';

		this.to = [];
		this.from = [];
		this.cc = [];
		this.bcc = [];
		this.replyTo = [];
		this.deliveredTo = [];

		this.fromAsString = '';
		this.fromAsStringClear = '';
		this.toAsString = '';
		this.toAsStringClear = '';
		this.senderAsString = '';
		this.senderAsStringClear = '';

		this.size = 0;
		this.timestamp = 0;
	};

	/**
	 * @param {AjaxJsonMessage} oJson
	 * @return {boolean}
	 */
	MessageSimpleModel.prototype.initByJson = function (oJson)
	{
		var bResult = false;

		if (oJson && 'Object/Message' === oJson['@Object'])
		{
			this.folder = Utils.pString(oJson.Folder);
			this.uid = Utils.pString(oJson.Uid);

			this.subject = Utils.pString(oJson.Subject);

			this.subjectPrefix = '';
			this.subjectSuffix = this.subject;

			if (Utils.isArray(oJson.SubjectParts))
			{
				this.subjectPrefix = Utils.pString(oJson.SubjectParts[0]);
				this.subjectSuffix = Utils.pString(oJson.SubjectParts[1]);
			}

			this.from = MessageHelper.emailArrayFromJson(oJson.From);
			this.to = MessageHelper.emailArrayFromJson(oJson.To);
			this.cc = MessageHelper.emailArrayFromJson(oJson.Cc);
			this.bcc = MessageHelper.emailArrayFromJson(oJson.Bcc);
			this.replyTo = MessageHelper.emailArrayFromJson(oJson.ReplyTo);
			this.deliveredTo = MessageHelper.emailArrayFromJson(oJson.DeliveredTo);

			this.size = Utils.pInt(oJson.Size);
			this.timestamp = Utils.pInt(oJson.DateTimeStampInUTC);

			this.fromAsString = MessageHelper.emailArrayToString(this.from, true);
			this.fromAsStringClear = MessageHelper.emailArrayToStringClear(this.from);

			this.toAsString = MessageHelper.emailArrayToString(this.to, true);
			this.toAsStringClear = MessageHelper.emailArrayToStringClear(this.to);

			this.populateSenderEmail();

			bResult = true;
		}

		return bResult;
	};

	MessageSimpleModel.prototype.populateSenderEmail = function (bDraftOrSentFolder)
	{
		this.senderAsString = this.fromAsString;
		this.senderAsStringClear = this.fromAsStringClear;

		if (bDraftOrSentFolder)
		{
			this.senderAsString = this.toAsString;
			this.senderAsStringClear = this.toAsStringClear;
		}
	};

	/**
	 * @static
	 * @param {AjaxJsonMessage} oJson
	 * @return {?MessageSimpleModel}
	 */
	MessageSimpleModel.newInstanceFromJson = function (oJson)
	{
		var oItem = oJson ? new MessageSimpleModel() : null;
		return oItem && oItem.initByJson(oJson) ? oItem : null;
	};

	module.exports = MessageSimpleModel;

}());