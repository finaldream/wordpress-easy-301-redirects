<?php

namespace WordpressEasy301Redirects;

use DateTime;
use JsonSerializable;

/**
 * EasyRedirection Object for Easy301Redirects
 *
 */
class Easy301Redirection implements JsonSerializable
{
    /** @var string $uuid */
    public $id;
    /** @var string $request */
    public $request;
    /** @var string $destination */
    private $destination;
    /** @var DateTime $createdAt */
    private $creationDate;
    /** @var DateTime $modifiedAt */
    private $modificationDate;
    /** @var int $order */
    private $order;

    public function __construct(string $request = '', string $destination = '', string $uuid = '', int $order = 0, DateTime $createdAt = null) {       
        $this->id = $uuid;
        $this->request = trim( sanitize_text_field($request) );
        $this->destination = trim( sanitize_text_field($destination) );
        $this->order = $order;
        $this->creationDate = $createdAt ?? new DateTime();        
    }

    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'request' => $this->getRequest(),
            'destination' => $this->getDestination(),
            'creationDate' => $this->getCreationDate()->format('m-d-y H:i:s'),
            'modificationDate' => $this->getModificationDate()->format('m-d-y H:i:s'),
            'order' => $this->getOrder(),           
        ];
    }

    public function jsonDecode(string $data) : Easy301Redirection
    {
        $obj = json_decode($data);
        //var_dump($obj);die;
        $this->id = $obj->id;
        $this->request =  $obj->request;
        $this->destination =  $obj->destination;
        $this->order = $obj->order;
        $this->creationDate = $obj->creationDate ? DateTime::createFromFormat('m-d-y H:i:s', $obj->creationDate) : new DateTime();
        $this->modificationDate = $obj->modificationDate  ? DateTime::createFromFormat('m-d-y H:i:s', $obj->modificationDate ) : null;
        return $this;
    }

    public function getId() : string
    {
        return $this->id;
    }
    
    public function getOrder() : int
    {
        return $this->order ?? 0;
    }

    public function getRequest() : string
    {
        return $this->request;
    }

    public function setRequest(string $request) : bool
    {
        $request = trim( sanitize_text_field($request) );
        if ($request !== $this->request) {
            $this->request = $request;
            $this->modificationDate = new DateTime();
            return true;
        }
        return false;
    }

    public function getDestination() : string
    {
        return $this->destination;
    }

    public function setDestination(string $destination) : bool
    {
        $destination = trim( sanitize_text_field($destination) );
        if ($destination !== $this->destination) {
            $this->destination = $destination;
            $this->modificationDate = new DateTime();
            return true;
        }
        return false;
    }

    public function getCreationDate() : DateTime
    {
        return $this->creationDate;
    }

    public function getModificationDate() : DateTime
    {
        return $this->modificationDate ?? $this->creationDate;
    }

    public function getCSVrow () : array
    {
        $row = [
            trim( sanitize_text_field($this->request )), 
            trim( sanitize_text_field($this->destination)), 
            $this->creationDate->format('Y-m-d H:i:s'),            
            $this->getModificationDate()->format('Y-m-d H:i:s'),
        ];
        return $row;
    }
}